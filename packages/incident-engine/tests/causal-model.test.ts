import { describe, it, expect } from 'vitest';
import { NativeCausalModel } from '../src/index.js';
import type { EvidenceItem } from '@investigator/evidence';

describe('NativeCausalModel (Deterministic Symbolic Reasoning)', () => {
  const model = new NativeCausalModel();

  it('should accurately identify Database Connection Pool Exhaustion and disprove memory leak', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-1',
        timestamp: '2026-09-21T14:00:00Z',
        source: 'deployment',
        service: 'api',
        type: 'deployment',
        severity: 'info',
        message: 'Deployment v2.3 applied to production cluster',
        originalReference: { file: 'deployment.json', line: 1 }
      },
      {
        id: 'ev-2',
        timestamp: '2026-09-21T14:02:45Z',
        source: 'database',
        service: 'postgres',
        type: 'log',
        severity: 'warn',
        message: 'postgres: connection pool usage high (85%)',
        originalReference: { file: 'database.log', line: 3 }
      },
      {
        id: 'ev-3',
        timestamp: '2026-09-21T14:03:10Z',
        source: 'database',
        service: 'postgres',
        type: 'log',
        severity: 'critical',
        message: 'postgres: connection pool exhausted (20/20 active connections reached)',
        originalReference: { file: 'database.log', line: 4 }
      },
      {
        id: 'ev-4',
        timestamp: '2026-09-21T14:03:20Z',
        source: 'application',
        service: 'api',
        type: 'log',
        severity: 'warn',
        message: 'acquire DB connection timed out after 5000ms',
        originalReference: { file: 'application.log', line: 2 }
      },
      {
        id: 'ev-5',
        timestamp: '2026-09-21T14:03:40Z',
        source: 'application',
        service: 'api',
        type: 'log',
        severity: 'error',
        message: 'HTTP 500 Internal Server Error: Database connection timeout',
        originalReference: { file: 'application.log', line: 3 }
      },
      {
        id: 'ev-6',
        timestamp: '2026-09-21T14:02:00Z',
        source: 'metrics',
        service: 'api',
        type: 'metric',
        severity: 'info',
        message: 'memory_usage_percent is normal',
        value: 42,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 1 }
      }
    ];

    const report = model.analyze(
      'Database connection pool exhaustion incident',
      ['api', 'postgres'],
      evidence,
      evidence.length,
      12
    );

    expect(report.rootCause.description).toBe('Database connection pool exhaustion');
    expect(report.rootCause.confidence).toBeGreaterThanOrEqual(0.9);
    expect(report.hypotheses.length).toBeGreaterThanOrEqual(3);

    // Verify primary hypothesis is strongly supported
    const h1 = report.hypotheses.find((h) => h.id === 'H1');
    expect(h1).toBeDefined();
    expect(h1?.status).toBe('strongly_supported');
    expect(h1?.supportingEvidenceIds).toContain('ev-2');
    expect(h1?.supportingEvidenceIds).toContain('ev-3');

    // Verify memory leak hypothesis was disproven by contradictory telemetry (Rule 12)
    const h2 = report.hypotheses.find((h) => h.id === 'H2');
    expect(h2).toBeDefined();
    expect(h2?.status).toBe('disproven');
    expect(h2?.contradictingEvidenceIds).toContain('ev-6');

    // Verify Causal Chain
    expect(report.causalChain.length).toBeGreaterThanOrEqual(3);
    expect(report.causalChain[0].role).toBe('root_cause');
    expect(report.recommendedActions.length).toBeGreaterThan(0);
  });

  it('should accurately identify CoreDNS Failure and link to upstream timeouts', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-dns-1',
        timestamp: '2026-09-21T15:02:00Z',
        source: 'coredns',
        service: 'coredns',
        type: 'log',
        severity: 'error',
        message: 'coredns: [ERROR] plugin/errors: 2 auth-service A: read udp 10.96.0.10:53->8.8.8.8:53: i/o timeout',
        originalReference: { file: 'coredns.log', line: 3 }
      },
      {
        id: 'ev-dns-2',
        timestamp: '2026-09-21T15:02:10Z',
        source: 'coredns',
        service: 'coredns',
        type: 'log',
        severity: 'critical',
        message: 'coredns: CoreDNS upstream DNS timeout: unreachable upstream resolver',
        originalReference: { file: 'coredns.log', line: 4 }
      },
      {
        id: 'ev-dns-3',
        timestamp: '2026-09-21T15:02:15Z',
        source: 'gateway',
        service: 'api-gateway',
        type: 'log',
        severity: 'warn',
        message: 'api-gateway: request failed: getaddrinfo EAI_AGAIN auth-service.prod.svc.cluster.local',
        originalReference: { file: 'gateway.log', line: 2 }
      },
      {
        id: 'ev-dns-4',
        timestamp: '2026-09-21T15:03:00Z',
        source: 'gateway',
        service: 'api-gateway',
        type: 'log',
        severity: 'error',
        message: 'HTTP 504 Gateway Timeout on /api/v1/checkout',
        originalReference: { file: 'gateway.log', line: 4 }
      }
    ];

    const report = model.analyze(
      'CoreDNS failure incident',
      ['api-gateway', 'coredns'],
      evidence,
      evidence.length,
      8
    );

    expect(report.rootCause.description).toBe('CoreDNS name resolution timeout / DNS failure');
    expect(report.rootCause.confidence).toBeGreaterThanOrEqual(0.9);

    const h1 = report.hypotheses.find((h) => h.id === 'H1');
    expect(h1?.status).toBe('strongly_supported');

    // Downstream database crash should be disproven
    const h2 = report.hypotheses.find((h) => h.id === 'H2');
    expect(h2?.status).toBe('disproven');
  });

  it('should accurately identify Memory Leak and Pod OOMKilled exit code 137', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-oom-1',
        timestamp: '2026-09-21T16:00:00Z',
        source: 'deployment',
        service: 'worker-service',
        type: 'deployment',
        severity: 'info',
        message: 'Add in-memory cache for event stream payloads without eviction TTL',
        originalReference: { file: 'deployment.json', line: 1 }
      },
      {
        id: 'ev-oom-2',
        timestamp: '2026-09-21T16:14:00Z',
        source: 'metrics',
        service: 'worker-service',
        type: 'metric',
        severity: 'warn',
        message: 'container_memory_usage_percent reached 99.8%',
        value: 99.8,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 4 }
      },
      {
        id: 'ev-oom-3',
        timestamp: '2026-09-21T16:14:30Z',
        source: 'kubernetes',
        service: 'kubelet',
        type: 'log',
        severity: 'critical',
        message: 'Container worker-service was OOMKilled (Exit Code 137), memory limit 1024Mi exceeded',
        originalReference: { file: 'kubernetes.log', line: 3 }
      },
      {
        id: 'ev-oom-4',
        timestamp: '2026-09-21T16:14:35Z',
        source: 'kubernetes',
        service: 'kubelet',
        type: 'log',
        severity: 'error',
        message: 'Pod worker-service is in CrashLoopBackOff',
        originalReference: { file: 'kubernetes.log', line: 4 }
      }
    ];

    const report = model.analyze(
      'Worker pod crashing incident',
      ['worker-service', 'kubelet'],
      evidence,
      evidence.length,
      9
    );

    expect(report.rootCause.description).toBe('Application memory leak leading to container OOMKilled');
    expect(report.rootCause.confidence).toBeGreaterThanOrEqual(0.9);

    const h1 = report.hypotheses.find((h) => h.id === 'H1');
    expect(h1?.status).toBe('strongly_supported');
    expect(h1?.supportingEvidenceIds).toContain('ev-oom-3');

    // Network partition should be disproven
    const h3 = report.hypotheses.find((h) => h.id === 'H3');
    expect(h3?.status).toBe('disproven');
  });

  it('should accurately identify Cascading Retry Storm and disprove database failure', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-rs-1',
        timestamp: '2026-09-22T10:15:25Z',
        source: 'gateway',
        service: 'envoy-gateway',
        type: 'log',
        severity: 'warn',
        message: 'retry storm detected: client retry multiplier exceeded 12x normal traffic volume',
        originalReference: { file: 'gateway.log', line: 12 }
      },
      {
        id: 'ev-rs-2',
        timestamp: '2026-09-22T10:15:45Z',
        source: 'application',
        service: 'checkout-api',
        type: 'log',
        severity: 'critical',
        message: 'checkout-api: ThreadPoolExecutor rejected execution: queue capacity 1000 exceeded, thread pool starvation',
        originalReference: { file: 'application.log', line: 7 }
      },
      {
        id: 'ev-rs-3',
        timestamp: '2026-09-22T10:15:50Z',
        source: 'metrics',
        service: 'order-db',
        type: 'metric',
        severity: 'info',
        message: 'order-db cpu_utilization is healthy (24%)',
        value: 24,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 4 }
      }
    ];

    const report = model.analyze('Retry storm test', ['checkout-api'], evidence, evidence.length, 10);
    expect(report.rootCause.description).toBe('Cascading retry storm with zero backoff causing thread pool starvation');
    expect(report.rootCause.confidence).toBeGreaterThanOrEqual(0.9);

    const h2 = report.hypotheses.find((h) => h.id === 'H2');
    expect(h2?.status).toBe('disproven');
    expect(h2?.contradictingEvidenceIds).toContain('ev-rs-3');
  });

  it('should accurately identify Disk Space Saturation on Kafka WAL and disprove consumer memory leak', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-dk-1',
        timestamp: '2026-09-22T11:01:00Z',
        source: 'kafka',
        service: 'kafka-broker',
        type: 'log',
        severity: 'critical',
        message: 'kafka-broker: disk full: java.io.IOException: No space left on device while appending to WAL',
        originalReference: { file: 'kafka.log', line: 6 }
      },
      {
        id: 'ev-dk-2',
        timestamp: '2026-09-22T11:01:20Z',
        source: 'metrics',
        service: 'kafka-broker',
        type: 'metric',
        severity: 'critical',
        message: 'storage volume disk_space_utilization 100% - disk full',
        value: 100,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 3 }
      },
      {
        id: 'ev-dk-3',
        timestamp: '2026-09-22T11:02:00Z',
        source: 'metrics',
        service: 'kafka-broker',
        type: 'metric',
        severity: 'info',
        message: 'kafka broker jvm_heap_usage is normal (45%)',
        value: 45,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 4 }
      }
    ];

    const report = model.analyze('Disk full test', ['kafka-broker'], evidence, evidence.length, 10);
    expect(report.rootCause.description).toBe('Disk space saturation and storage exhaustion freezing Kafka broker WAL commit logs');

    const h2 = report.hypotheses.find((h) => h.id === 'H2');
    expect(h2?.status).toBe('disproven');
    expect(h2?.contradictingEvidenceIds).toContain('ev-dk-3');
  });

  it('should accurately identify Expired Ingress TLS Certificate and disprove application crash', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-tls-1',
        timestamp: '2026-09-22T00:00:10Z',
        source: 'ingress',
        service: 'ingress-nginx',
        type: 'log',
        severity: 'critical',
        message: 'ingress-nginx: SSL certificate expired: x509: certificate has expired or is not yet valid: notAfter=2026-09-22T00:00:00Z',
        originalReference: { file: 'ingress.log', line: 4 }
      },
      {
        id: 'ev-tls-2',
        timestamp: '2026-09-22T00:01:00Z',
        source: 'metrics',
        service: 'api-gateway',
        type: 'metric',
        severity: 'info',
        message: 'api-gateway cpu_utilization is completely idle (4%)',
        value: 4,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 1 }
      }
    ];

    const report = model.analyze('TLS expiry test', ['ingress-nginx'], evidence, evidence.length, 10);
    expect(report.rootCause.description).toBe('Ingress TLS/SSL certificate expired causing TLS handshake failure and 502 Bad Gateway');

    const h2 = report.hypotheses.find((h) => h.id === 'H2');
    expect(h2?.status).toBe('disproven');
    expect(h2?.contradictingEvidenceIds).toContain('ev-tls-2');
  });

  it('should accurately identify ConfigMap Drift and disprove auth service outage', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-cfg-1',
        timestamp: '2026-09-22T11:59:15Z',
        source: 'application',
        service: 'user-api',
        type: 'log',
        severity: 'warn',
        message: 'user-api: ConfigMap drift detected: AUTH_PROVIDER_URL endpoint updated to http://auth-servce.prod.svc.cluster.local:8080',
        originalReference: { file: 'application.log', line: 3 }
      },
      {
        id: 'ev-cfg-2',
        timestamp: '2026-09-22T11:59:35Z',
        source: 'application',
        service: 'user-api',
        type: 'log',
        severity: 'critical',
        message: 'user-api: configuration drift: falling back to offline dummy validator due to invalid AUTH_PROVIDER_URL in ConfigMap',
        originalReference: { file: 'application.log', line: 5 }
      },
      {
        id: 'ev-cfg-3',
        timestamp: '2026-09-22T12:00:30Z',
        source: 'metrics',
        service: 'auth-service',
        type: 'metric',
        severity: 'info',
        message: 'auth-service is healthy and idle (14% cpu)',
        value: 14,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 3 }
      }
    ];

    const report = model.analyze('Config drift test', ['user-api'], evidence, evidence.length, 10);
    expect(report.rootCause.description).toBe('Kubernetes ConfigMap environment variable drift triggering silent dummy auth fallback and mass 401 errors');

    const h2 = report.hypotheses.find((h) => h.id === 'H2');
    expect(h2?.status).toBe('disproven');
    expect(h2?.contradictingEvidenceIds).toContain('ev-cfg-3');
  });

  it('should accurately identify Redis Cache Stampede and disprove query regression', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-rc-1',
        timestamp: '2026-09-22T14:00:02Z',
        source: 'redis',
        service: 'redis',
        type: 'log',
        severity: 'critical',
        message: 'redis: cache stampede: simultaneous cache miss burst on expired key catalog:trending:products (24,800 missed queries)',
        originalReference: { file: 'redis.log', line: 4 }
      },
      {
        id: 'ev-rc-2',
        timestamp: '2026-09-22T14:00:05Z',
        source: 'metrics',
        service: 'redis-cluster',
        type: 'metric',
        severity: 'critical',
        message: 'cache_hit_ratio collapsed to 12.1% due to cache stampede on expired hot key',
        value: 12.1,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 2 }
      },
      {
        id: 'ev-rc-3',
        timestamp: '2026-09-22T14:00:06Z',
        source: 'database',
        service: 'postgres',
        type: 'log',
        severity: 'critical',
        message: 'postgres: connection pool exhausted (100/100 connections), queueing 18,200 pending query requests',
        originalReference: { file: 'database.log', line: 3 }
      }
    ];

    const report = model.analyze('Cache stampede test', ['redis', 'postgres'], evidence, evidence.length, 10);
    expect(report.rootCause.description).toBe('Redis cache stampede / dogpiling meltdown on expired hot key overwhelming database connection pool');

    const h2 = report.hypotheses.find((h) => h.id === 'H2');
    expect(h2?.status).toBe('disproven');
  });

  it('should accurately identify Overlay Network MTU Mismatch and disprove CPU throttling', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-net-1',
        timestamp: '2026-09-22T14:59:00Z',
        source: 'network',
        service: 'cni-network',
        type: 'log',
        severity: 'warn',
        message: 'cni-network: MTU mismatch detected: outer encapsulation header exceeds interface MTU (packet size 1528 > MTU 1500 with DF set)',
        originalReference: { file: 'network.log', line: 3 }
      },
      {
        id: 'ev-net-2',
        timestamp: '2026-09-22T15:01:00Z',
        source: 'metrics',
        service: 'cni-network',
        type: 'metric',
        severity: 'critical',
        message: 'tcp_retransmission_rate reached 38.4% due to MTU mismatch packet loss',
        value: 38.4,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 2 }
      },
      {
        id: 'ev-net-3',
        timestamp: '2026-09-22T15:01:30Z',
        source: 'metrics',
        service: 'order-service',
        type: 'metric',
        severity: 'info',
        message: 'order-service cpu_utilization is idle (6%)',
        value: 6,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 3 }
      }
    ];

    const report = model.analyze('MTU mismatch test', ['cni-network'], evidence, evidence.length, 10);
    expect(report.rootCause.description).toBe('Overlay network MTU mismatch causing severe TCP packet retransmissions and window collapse');

    const h2 = report.hypotheses.find((h) => h.id === 'H2');
    expect(h2?.status).toBe('disproven');
    expect(h2?.contradictingEvidenceIds).toContain('ev-net-3');
  });

  it('should accurately identify Database Transaction Deadlock and disprove connection pool exhaustion', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-dl-1',
        timestamp: '2026-09-22T16:00:17Z',
        source: 'database',
        service: 'postgres',
        type: 'log',
        severity: 'critical',
        message: 'postgres: ERROR: deadlock detected: Process 19482 waits for ShareLock on transaction 88193; Process 19499 waits for ExclusiveLock',
        originalReference: { file: 'database.log', line: 3 }
      },
      {
        id: 'ev-dl-2',
        timestamp: '2026-09-22T16:00:30Z',
        source: 'metrics',
        service: 'postgres-db',
        type: 'metric',
        severity: 'info',
        message: 'connection_pool_usage is healthy (24/100 connections)',
        value: 24,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 3 }
      },
      {
        id: 'ev-dl-3',
        timestamp: '2026-09-22T16:00:35Z',
        source: 'metrics',
        service: 'postgres-db',
        type: 'metric',
        severity: 'info',
        message: 'postgres-db cpu_utilization is low (12%)',
        value: 12,
        unit: 'percent',
        originalReference: { file: 'metrics.json', line: 4 }
      }
    ];

    const report = model.analyze('Deadlock test', ['postgres'], evidence, evidence.length, 10);
    expect(report.rootCause.description).toBe('Database transaction deadlock and cyclic row lock contention causing statement aborts');

    const h2 = report.hypotheses.find((h) => h.id === 'H2');
    expect(h2?.status).toBe('disproven');
    expect(h2?.contradictingEvidenceIds).toContain('ev-dl-2');

    const h3 = report.hypotheses.find((h) => h.id === 'H3');
    expect(h3?.status).toBe('disproven');
    expect(h3?.contradictingEvidenceIds).toContain('ev-dl-3');
  });

  it('should fall back gracefully to generic anomaly detection if unknown pattern', () => {
    const evidence: EvidenceItem[] = [
      {
        id: 'ev-gen-1',
        timestamp: '2026-09-21T17:00:00Z',
        source: 'application',
        service: 'payment-svc',
        type: 'log',
        severity: 'error',
        message: 'Unexpected third-party SSL handshake reset',
        originalReference: { file: 'payment.log', line: 12 }
      }
    ];

    const report = model.analyze(
      'Generic anomaly',
      ['payment-svc'],
      evidence,
      evidence.length,
      5
    );

    expect(report.rootCause.description).toContain('payment-svc');
    expect(report.hypotheses[0].status).toBe('investigating');
    expect(report.statistics.modelCalls).toBe(0);
  });
});
