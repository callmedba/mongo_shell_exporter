/*

  This script translates old bridge_config.js file to the new metric AST format

*/

const util = require('util')

const ReadHistogram = class {}
const Read = class {}
const PathsAsSingleMetricWithLabels = class {}
const RemapKeysAsMetrics = class {}
const EachKeyAsLabeledMetric = class {}
const Ignore = class {}
const UsecToSec = class {}
const EachKeyAsLabeledMetricWithSuffix = class {}

const config = [
  {
    metric_name: 'network_connections',
    type: 'gauge',
    help:
      'Reports the status of the connections. Use these values to assess the current load and capacity requirements of the server.',
    action: EachKeyAsLabeledMetric,
    path: 'connections',
    label_name: 'type'
  },

  {
    metric_name: 'operations_count',
    type: 'counter',
    help: 'Database operations by type since the mongod instance last started',
    action: EachKeyAsLabeledMetric,
    path: 'opcounters',
    label_name: 'type'
  },

  {
    metric_name: 'operations_read_concern_count',
    type: 'counter',
    help:
      'Database operations read concern level specified by query operations to the mongod instance since it last started.',
    action: EachKeyAsLabeledMetric,
    path: 'opReadConcernCounters',
    label_name: 'level'
  },

  {
    metric_name: 'replication_operations_count',
    type: 'counter',
    help:
      'Database replication operations by type since the mongod instance last started',
    action: EachKeyAsLabeledMetric,
    path: 'opcountersRepl',
    label_name: 'type'
  },

  {
    metric_name: 'aggregation_stage_run_count',
    type: 'counter',
    help: 'How many time what kind of aggregation pipeline stages had run',
    action: EachKeyAsLabeledMetric,
    path: ['metrics', 'aggStageCounters'],
    label_name: 'stage'
  },

  {
    metric_name: 'commands',
    type: 'counter',
    help: 'Reports use or failure count of database commands by command',
    action: EachKeyAsLabeledMetricWithSuffix,
    path: ['metrics', 'commands'],
    label_name: 'command'
  },

  {
    metric_name: 'documents_access_total',
    type: 'counter',
    help: 'Reflects document access and modification patterns since startup',
    action: EachKeyAsLabeledMetric,
    path: ['metrics', 'document'],
    label_name: 'type'
  },

  {
    action: RemapKeysAsMetrics,
    path: ['wiredTiger', 'block-manager'],
    metric_name: 'wt_block_manager',
    default_type: 'counter',
    map: {
      'blocks pre-loaded': { name: 'preloaded_blocks_total' },
      'blocks read': { name: 'read_blocks_total' },
      'blocks written': { name: 'written_blocks_total' },
      'bytes read': { name: 'read_bytes_total' },
      'bytes written': { name: 'written_bytes_total' },
      'bytes written for checkpoint': {
        name: 'written_for_checkpoint_bytes_total'
      },
      'mapped blocks read': { name: 'read_mapped_blocks_total' },
      'mapped bytes read': { name: 'read_mapped_bytes_count_total' },

      // Only for collection
      'allocations requiring file extension': {
        name: 'file_extenstions_count'
      },
      'blocks allocated': { name: 'allocated_blocks_total' },
      'blocks freed': { name: 'freed_blocks_total' },
      'checkpoint size': { name: 'checkpoint_size_bytes_total' },
      'file bytes available for reuse': {
        name: 'reusable_bytes',
        type: 'gauge'
      },
      'file size in bytes': { name: 'file_size_bytes' },

      'file allocation unit size': { name: 'allocation_unit_size' },

      // Move to metadata?
      'file magic number': { name: 'file_magic_number' },
      'file major version number': { name: 'version_major' },
      'minor version number': { name: 'version_minor' }
    }
  },

  {
    action: RemapKeysAsMetrics,
    path: ['wiredTiger', 'cache'],
    metric_name: 'wt_cache',
    default_type: 'counter',
    map: {
      'application threads page read from disk to cache count': {
        name: 'app_read_from_disk_to_cache_bytes_total'
      },
      'application threads page write from cache to disk count': {
        name: 'app_write_from_cache_to_disk_bytes_total'
      },

      'application threads page read from disk to cache time (usecs)': {
        name: 'app_read_from_disk_to_cache_seconds_total',
        transform: UsecToSec
      },
      'application threads page write from cache to disk time (usecs)': {
        name: 'app_write_from_cache_to_disk_seconds_total',
        transform: UsecToSec
      },

      'bytes belonging to page images in the cache': {
        name: 'page_image_bytes',
        type: 'gauge'
      },
      'bytes not belonging to page images in the cache': {
        name: 'not_page_image_bytes',
        type: 'gauge'
      },

      'bytes belonging to the cache overflow table in the cache': {
        name: 'overflow_bytes',
        type: 'gauge'
      },
      'bytes currently in the cache': { name: 'bytes', type: 'gauge' },
      'bytes dirty in the cache cumulative': { name: 'dirty_bytes_sum' },

      'bytes read into cache': { name: 'read_into_bytes_total' },
      'bytes written from cache': { name: 'written_from_bytes_total' },

      'cache overflow cursor application thread wait time (usecs)': {
        name: 'overflow_cursor_thread_wait_seconds_total',
        labels: { type: 'app' },
        transform: UsecToSec
      },
      'cache overflow cursor internal thread wait time (usecs)': {
        name: 'overflow_cursor_thread_wait_seconds_total',
        labels: { type: 'internal' },
        transform: UsecToSec
      },
      'cache overflow score': { name: 'overflow_score', type: 'gauge' },
      'cache overflow table entries': {
        name: 'overflow_table_entries',
        type: 'gauge'
      },
      'cache overflow table insert calls': {
        name: 'overflow_table_calls_total',
        labels: { type: 'insert' }
      },
      'cache overflow table max on-disk size': {
        name: 'overflow_table_disk_size_max',
        type: 'gauge'
      },
      'cache overflow table on-disk size': {
        name: 'overflow_table_disk_size',
        type: 'gauge'
      },
      'cache overflow table remove calls': {
        name: 'overflow_table_calls_total',
        labels: { type: 'remove' }
      },

      'checkpoint blocked page eviction': {
        name: 'page_eviction_blocked_total',
        label: { reason: 'checkpoint' }
      },

      // "eviction calls to get a page found queue empty after locking": { name: "" },
      // "eviction calls to get a page found queue empty": { name: "" },
      // "eviction calls to get a page": { name: "" },
      // "eviction currently operating in aggressive mode": { name: "" },
      // "eviction empty score": { name: "" },
      // "eviction passes of a file": { name: "" },
      // "eviction server candidate queue empty when topping up": { name: "" },
      // "eviction server candidate queue not empty when topping up": { name: "" },
      // "eviction server evicting pages": { name: "" },
      // "eviction server slept, because we did not make progress with eviction": { name: "" },
      // "eviction server unable to reach eviction goal": { name: "" },
      // "eviction server waiting for a leaf page": { name: "" },
      'eviction state': { name: 'eviction_state', type: 'gauge' },

      'eviction walk target pages histogram - 0-9': {
        name: 'eviction_walk_target_pages',
        labels: { le: '9' },
        type: 'histogram'
      },
      'eviction walk target pages histogram - 10-31': {
        name: 'eviction_walk_target_pages',
        labels: { le: '31' },
        type: 'histogram'
      },
      'eviction walk target pages histogram - 32-63': {
        name: 'eviction_walk_target_pages',
        labels: { le: '63' },
        type: 'histogram'
      },
      'eviction walk target pages histogram - 64-128': {
        name: 'eviction_walk_target_pages',
        labels: { le: '127' },
        type: 'histogram'
      },
      'eviction walk target pages histogram - 128 and higher': {
        name: 'eviction_walk_target_pages',
        labels: { le: '+Inf' },
        type: 'histogram'
      },

      'eviction walk target strategy both clean and dirty pages': {
        name: 'eviction_walk_strategy',
        label: { type: 'clean and dirty' }
      },
      'eviction walk target strategy only clean pages': {
        name: 'eviction_walk_strategy',
        label: { type: 'only clean' }
      },
      'eviction walk target strategy only dirty pages': {
        name: 'eviction_walk_strategy',
        label: { type: 'only dirty' }
      },

      'eviction walks abandoned': {
        name: 'eviction_walks',
        label: { event: 'abandoned' }
      },
      'eviction walks gave up because they restarted their walk twice': {
        name: 'eviction_walks',
        label: { event: ' gave up because they restarted their walk twice' }
      },
      'eviction walks gave up because they saw too many pages and found no candidates': {
        name: 'eviction_walks',
        label: {
          event:
            'gave up because they saw too many pages and found no candidate'
        }
      },
      'eviction walks gave up because they saw too many pages and found too few candidates': {
        name: 'eviction_walks',
        label: {
          event:
            'gave up because they saw too many pages and found too few candidates'
        }
      },
      'eviction walks reached end of tree': {
        name: 'eviction_walks',
        label: { event: 'reached end of tree' }
      },
      'eviction walks started from root of tree': {
        name: 'eviction_walks',
        label: { event: 'started from root of tree' }
      },
      'eviction walks started from saved location in tree': {
        name: 'eviction_walks',
        label: { event: 'started from saved location in tree' }
      },

      'eviction walk passes of a file': {
        name: 'eviction_walk_passes_of_a_file'
      },

      'eviction worker thread active': {
        name: 'eviction_worker_threads',
        label: { state: 'active', type: 'gauge' }
      },
      'eviction worker thread created': {
        name: 'eviction_worker_threads',
        label: { state: 'created', type: 'gauge' }
      },
      'eviction worker thread evicting pages': {
        name: 'eviction_worker_threads',
        label: { state: 'evicting', type: 'gauge' }
      },
      'eviction worker thread removed': {
        name: 'eviction_worker_threads',
        label: { state: 'removed', type: 'gauge' }
      },
      'eviction worker thread stable number': {
        name: 'eviction_worker_threads',
        label: { state: 'stable', type: 'gauge' }
      },

      'files with active eviction walks': {
        name: 'files_current',
        labels: { type: 'active eviction walks' },
        type: 'gauge'
      },
      'files with new eviction walks started': {
        name: 'files_current',
        labels: { type: 'new eviction walks started' },
        type: 'gauge'
      },

      // "force re-tuning of eviction workers once in a while": { name: "" },
      // "forced eviction - pages evicted that were clean count": { name: "" },
      // "forced eviction - pages evicted that were dirty count": { name: "" },
      // "forced eviction - pages selected unable to be evicted count": { name: "" },

      // "forced eviction - pages evicted that were clean time (usecs)": { name: "" },
      // "forced eviction - pages evicted that were dirty time (usecs)": { name: "" },
      // "forced eviction - pages selected unable to be evicted time": { name: "" },

      // "forced eviction - pages selected count": { name: "" },
      // "forced eviction - pages selected because of too many deleted items count": { name: "" },

      'hazard pointer blocked page eviction': {
        name: 'page_eviction_blocked_total',
        label: { reason: 'hazard pointer' }
      },
      'hazard pointer check calls': {
        name: 'hazard_pointer_check_calls_total'
      },
      'hazard pointer check entries walked': {
        name: 'hazard_pointer_check_entries_walked_total'
      },
      'hazard pointer maximum array length': {
        name: 'hazard_pointer_max_array_size',
        type: 'gauge'
      },

      'in-memory page passed criteria to be split': {
        name: 'split_passed_criteris_pages_total'
      },
      'in-memory page splits': { name: 'split_pages_total' },

      'internal pages evicted': {
        name: 'evicted_pages_total',
        labels: { type: 'internal' }
      },
      'internal pages queued for eviction': {
        name: 'eviction_qeueu_pages',
        label: { type: 'internal' },
        type: 'gauge'
      },
      'internal pages seen by eviction walk that are already queued': {
        name: 'seen_by_eviction_walk_already_queued_pages'
      },
      'internal pages seen by eviction walk': {
        name: 'seen_by_eviction_walk_pages'
      },

      'internal pages split during eviction': {
        name: 'split_during_eviction_pages_total',
        label: { type: 'internal' }
      },
      'leaf pages split during eviction': {
        name: 'split_during_eviction_pages_total',
        label: { type: 'leaf' }
      },
      'page split during eviction deepened the tree': {
        name: 'split_during_eviction_pages_total',
        label: { type: 'deepened the tree' }
      },

      'maximum bytes configured': { name: 'max_size_bytes', type: 'gauge' },
      'maximum page size at eviction': {
        name: 'evictied_page_size_bytes_max',
        type: 'gauge'
      },
      'modified pages evicted by application threads': {
        name: 'evicted_pages_total',
        labels: { type: 'modified' }
      },
      'modified pages evicted': {
        name: 'evicted_pages_total',
        labels: { type: 'modified' }
      },
      'operations timed out waiting for space in cache': {
        name: 'ops_timeouted_waiting_for_space_total'
      },
      'overflow pages read into cache': {
        name: 'read_into_pages_total',
        label: { event: 'overflow' }
      },

      'pages currently held in the cache': { name: 'pages', type: 'gauge' },
      'pages evicted by application threads': {
        name: 'evicted_pages_total',
        labels: { type: 'by application threads' }
      },
      'pages queued for eviction post lru sorting': {
        name: 'eviction_qeueu_pages',
        label: { type: 'post lru sorting' },
        type: 'gauge'
      },
      'pages queued for eviction': {
        name: 'eviction_qeueu_pages',
        type: 'gauge'
      },
      'pages queued for urgent eviction during walk': {
        name: 'eviction_qeueu_pages',
        label: { type: 'urgent during walk' },
        type: 'gauge'
      },
      'pages queued for urgent eviction': {
        name: 'eviction_qeueu_pages',
        label: { type: 'urgent' },
        type: 'gauge'
      },

      'pages read into cache after truncate in prepare state': {
        name: 'read_into_pages_total',
        label: { event: 'after truncate in prepare state' }
      },
      'pages read into cache after truncate': {
        name: 'read_into_pages_total',
        label: { event: 'after truncate' }
      },
      'pages read into cache requiring cache overflow entries': {
        name: 'read_into_pages_total',
        label: { event: 'requiring cache overflow entries' }
      },
      'pages read into cache requiring cache overflow for checkpoint': {
        name: 'read_into_pages_total',
        label: { event: 'requiring cache overflow for checkpoint' }
      },
      'pages read into cache skipping older cache overflow entries': {
        name: 'read_into_pages_total',
        label: { event: 'skipping older cache overflow entries' }
      },
      'pages read into cache with skipped cache overflow entries needed later by checkpoint': {
        name: 'read_into_pages_total',
        label: {
          event:
            'with skipped cache overflow entries needed later by checkpoint'
        }
      },
      'pages read into cache with skipped cache overflow entries needed later': {
        name: 'read_into_pages_total',
        label: { event: 'with skipped cache overflow entries needed later' }
      },
      'pages read into cache': { name: 'read_into_pages_total' },

      'pages requested from the cache': { name: 'requested_pages_total' },
      'pages seen by eviction walk that are already queued': {
        name: 'eviction_walk_pages_seen',
        labels: { type: 'already queued' }
      },
      'pages seen by eviction walk': { name: 'eviction_walk_pages_seen' },

      'pages selected for eviction unable to be evicted as the parent page has overflow items': {
        name: 'eviction_failed_pages_total',
        label: { reason: 'as the parent page has overflow items' }
      },
      'pages selected for eviction unable to be evicted because of active children on an internal page': {
        name: 'eviction_failed_pages_total',
        label: { reason: 'because of active children on an internal page' }
      },
      'pages selected for eviction unable to be evicted because of failure in reconciliation': {
        name: 'eviction_failed_pages_total',
        label: { reason: 'evicted because of failure in reconciliation' }
      },
      'pages selected for eviction unable to be evicted due to newer modifications on a clean page': {
        name: 'eviction_failed_pages_total',
        label: { reason: 'due to newer modifications on a clean page' }
      },
      'pages selected for eviction unable to be evicted': {
        name: 'eviction_failed_pages_total'
      },

      'data source pages selected for eviction unable to be evicted': {
        name: 'eviction_failed_data_source_pages_total'
      },

      'pages walked for eviction': { name: 'eviction_walked_pages_total' },
      'pages written from cache': { name: 'written_pages_total' },
      'pages written requiring in-memory restoration': {
        name: 'written_pages_total',
        label: { type: 'requiring in-memory restoration' }
      },
      'page written requiring cache overflow records': {
        name: 'written_pages_total',
        label: { type: 'requiring cache overflow records' }
      },

      'percentage overhead': { name: 'overhead_percent', type: 'gauge' },

      'tracked bytes belonging to internal pages in the cache': {
        name: 'pages_internal_bytes',
        type: 'gauge'
      },
      'tracked bytes belonging to leaf pages in the cache': {
        name: 'pages_leaf_bytes',
        type: 'gauge'
      },
      'tracked dirty bytes in the cache': {
        name: 'dirty_bytes',
        type: 'gauge'
      },
      'tracked dirty pages in the cache': {
        name: 'dirty_pages',
        type: 'gauge'
      },

      'unmodified pages evicted': {
        name: 'evicted_pages_total',
        labels: { type: 'unmodified' }
      }
    }
  },

  // Collection stats
  {
    action: Ignore,
    paths: [
      'ns',
      'indexBuilds',
      'indexSizes',
      'nindexes',
      ['wiredTiger', 'creationString'],
      ['wiredTiger', 'metadata', 'infoObj']
    ]
  },

  {
    metric_name: 'collection_info',
    type: 'gauge',
    help: 'Collection Metadata',
    paths: [
      'capped',
      ['wiredTiger', 'uri'],
      ['wiredTiger', 'type'],
      ['wiredTiger', 'metadata', 'formatVersion']
    ],
    action: PathsAsSingleMetricWithLabels
  },

  {
    metric_name: 'probe_scale_factor',
    type: 'gauge',
    action: Read,
    path: 'scaleFactor'
  },

  {
    metric_name: 'collection_document_size_avg_bytes',
    type: 'gauge',
    action: Read,
    path: 'avgObjSize'
  },

  {
    metric_name: 'collection_count',
    type: 'gauge',
    action: Read,
    path: 'count'
  },

  {
    metric_name: 'collection_size_bytes',
    type: 'gauge',
    action: Read,
    path: 'size'
  },

  {
    metric_name: 'collection_storage_size_bytes',
    type: 'gauge',
    action: Read,
    path: 'storageSize'
  },

  {
    metric_name: 'collection_index_size_bytes',
    type: 'gauge',
    action: Read,
    path: 'totalIndexSize'
  },

  {
    metric_name: 'collection_capped_max_count',
    type: 'gauge',
    action: Read,
    path: 'capped'
  },

  {
    metric_name: 'collection_capped_max_count',
    type: 'gauge',
    action: Read,
    path: 'max'
  },

  {
    metric_name: 'collection_capped_max_size_bytes',
    type: 'gauge',
    action: Read,
    path: 'maxSize'
  },

  {
    action: RemapKeysAsMetrics,
    path: ['wiredTiger', 'btree'],
    metric_name: 'wt_btree',
    default_type: 'gauge',
    map: {
      'btree checkpoint generation': { name: 'checkpoint_generation' },

      'column-store fixed-size leaf pages': {
        name: 'column_store_pages',
        labels: { type: 'fixed-size leaf' }
      },
      'column-store internal pages': {
        name: 'column_store_pages',
        labels: { type: 'internal' }
      },
      'column-store variable-size RLE encoded values': {
        name: 'column_store_varsize_values',
        labels: { type: 'RLE encoded' }
      },
      'column-store variable-size deleted values': {
        name: 'column_store_varsize_values',
        labels: { type: 'deleted' }
      },
      'column-store variable-size leaf pages': {
        name: 'column_store_pages',
        labels: { type: 'variable-size leaf' }
      },

      'fixed-record size': { name: 'fixed_record_size' },

      'maximum internal page key size': {
        name: 'leaf_page_size_max_bytes',
        labels: { type: 'internal key' }
      },
      'maximum internal page size': {
        name: 'leaf_page_size_max_bytes',
        labels: { type: 'internal' }
      },
      'maximum leaf page key size': {
        name: 'leaf_page_size_max_bytes',
        labels: { type: 'leaf key' }
      },
      'maximum leaf page size': {
        name: 'leaf_page_size_max_bytes',
        labels: { type: 'leaf' }
      },
      'maximum leaf page value size': {
        name: 'leaf_page_size_max_bytes',
        labels: { type: 'leaf value' }
      },
      'maximum tree depth': { name: 'depth' },

      'number of key/value pairs': { name: 'kv_pairs' },
      'overflow pages': { name: 'overflow_pages' },
      'pages rewritten by compaction': { name: 'paged_rewriten_by_compaction' },

      'row-store empty values': { name: 'row_store_empty_values' },
      'row-store internal pages': {
        name: 'row_store_pages',
        labels: { type: 'internal' }
      },
      'row-store leaf pages': {
        name: 'row_store_pages',
        labels: { type: 'leaf' }
      }
    }
  },

  {
    action: RemapKeysAsMetrics,
    path: ['wiredTiger', 'cache_walk'],
    metric_name: 'wt_cache_walk',
    default_type: 'gauge',
    map: {
      'Maximum page size seen': { name: 'seen_page_size_max' },
      'Average on-disk page image size seen': {
        name: 'on_disk_page_image_size_avg'
      },
      'Minimum on-disk page image size seen': {
        name: 'on_disk_page_image_size_min'
      },

      'On-disk page image sizes smaller than a single allocation unit': {
        name: 'on_disk_page_image_smalled_than_unit'
      },

      'Current eviction generation': { name: 'eviction_generation' },
      'Average difference between current eviction generation when the page was last considered': {
        name: 'eviction_generation_gap_avg'
      },
      'Maximum difference between current eviction generation when the page was last considered': {
        name: 'eviction_generation_gap_max'
      },

      'Number of pages never visited by eviction server': {
        name: 'pages_never_visited_for_eviction'
      },
      'Average time in cache for pages that have been visited by the eviction server': {
        name: 'time_in_cache_avg',
        labels: { type: 'visited' }
      },
      'Average time in cache for pages that have not been visited by the eviction server': {
        name: 'time_in_cache_avg',
        labels: { type: 'visited' }
      },

      'Pages that could not be queued for eviction': {
        name: 'pages_total',
        label: { type: 'could not be queued for eviction' }
      },
      'Pages currently queued for eviction': {
        name: 'pages_total',
        label: { type: 'queued for eviction' }
      },
      'Clean pages currently in cache': {
        name: 'pages_total',
        label: { type: 'clean' }
      },
      'Dirty pages currently in cache': {
        name: 'pages_total',
        label: { type: 'dirty' }
      },
      'Leaf pages currently in cache': {
        name: 'pages_total',
        label: { type: 'leaf' }
      },
      'Internal pages currently in cache': {
        name: 'pages_total',
        label: { type: 'internal' }
      },
      'Total number of pages currently in cache': { name: 'pages_total' },

      'Entries in the root page': { name: 'root_page_entries_count' },
      'Size of the root page': { name: 'root_page_size_bytes' },

      'Pages created in memory and never written': {
        name: 'created_and_never_writtend_pages_total',
        type: 'counter'
      },
      'Refs skipped during cache traversal': { name: 'refs_skipped' }
    }
  },

  {
    action: RemapKeysAsMetrics,
    path: ['wiredTiger', 'compression'],
    metric_name: 'wt_compresssion',
    default_type: 'counter',
    map: {
      'compressed pages read': { name: 'read_pages' },
      'compressed pages written': { name: 'written_pages' },
      'page written failed to compress': {
        name: 'written_failed_to_compress_pages'
      },
      'page written was too small to compress': {
        name: 'written_too_small_to_compress_pages'
      },

      'compressed page maximum internal page size prior to compression': {
        name: 'page_size_before_bytes_max',
        labels: { type: 'internal' },
        type: 'gauge'
      },
      'compressed page maximum leaf page size prior to compression ': {
        name: 'page_size_before_bytes_max',
        labels: { type: 'leaf' },
        type: 'gauge'
      }
    }
  },

  {
    action: RemapKeysAsMetrics,
    path: ['wiredTiger', 'cursor'],
    metric_name: 'wt_cursor',
    default_type: 'counter',
    map: {
      'cursor operation restarted': { name: 'ops_restarted' },
      'cursor-insert key and value bytes inserted': {
        name: 'inserted_key_value_bytes'
      },
      'cursor-remove key bytes removed': { name: 'removed_key_bytes' },
      'cursor-update value bytes updated': { name: 'updated_value_bytes' },
      'cursors reused from cache': { name: 'reused_from_cache' },
      'open cursor count': { name: 'open', type: 'gauge' }
    }
  },

  {
    metric_name: 'wt_cursor_calls',
    type: 'counter',
    action: EachKeyAsLabeledMetric,
    path: ['wiredTiger', 'cursor'],
    label_name: 'type'
  },

  {
    action: RemapKeysAsMetrics,
    path: ['wiredTiger', 'LSM'],
    metric_name: 'wt_lsm',
    default_type: 'counter',
    map: {
      'chunks in the LSM tree': { name: 'chunks_count', type: 'gauge' },
      'bloom filters in the LSM tree': { name: 'filters_count', type: 'gauge' },
      'bloom filter false positives': { name: 'filter_false_positive' },
      'bloom filter hits': { name: 'filter_hits' },
      'bloom filter misses': { name: 'filter_misses' },
      'bloom filter pages evicted from cache': { name: 'evicted_pages_total' },
      'bloom filter pages read into cache': { name: 'read_from_cache_pages' },
      'total size of bloom filters': { name: 'filter_size', type: 'gauge' },

      'sleep for LSM checkpoint throttle': {
        name: 'sleep_throttle',
        labels: { type: 'checkpoint' }
      },
      'sleep for LSM merge throttle': {
        name: 'sleep_throttle',
        labels: { type: 'merge' }
      },

      'highest merge generation in the LSM tree': {
        name: 'merge_generation',
        type: 'gauge'
      },
      'queries that could have benefited from a Bloom filter that did not exist': {
        name: 'queires_couldve_use_filters_but_havent'
      }
    }
  },

  {
    action: RemapKeysAsMetrics,
    path: ['wiredTiger', 'reconciliation'],
    metric_name: 'wt_reconciliation',
    default_type: 'counter',
    map: {
      'dictionary matches': { name: 'dictionary_mateches' },
      'page checksum matches': { name: 'checksum_matches' },

      'internal page multi-block writes': {
        name: 'multi_block_writes',
        labels: { type: 'internal' }
      },
      'leaf page multi-block writes': {
        name: 'multi_block_writes',
        labels: { type: 'leaf' }
      },

      'internal-page overflow keys': {
        name: 'overflow_keys',
        labels: { type: 'internal' }
      },
      'leaf-page overflow keys': {
        name: 'overflow_keys',
        labels: { type: 'leaf' }
      },

      'internal page key bytes discarded using suffix compression': {
        name: 'page_key_discarded_bytes',
        labels: { type: 'internal suffix compression' }
      },
      'leaf page key bytes discarded using prefix compression': {
        name: 'page_key_discarded_bytes',
        labels: { type: 'leaf prefix compression' }
      },

      'maximum blocks required for a page': {
        name: 'blocks_required_for_page_max',
        type: 'gauge'
      },
      'overflow values written': { name: 'overflow_values_written' },

      'page reconciliation calls': { name: 'calls' },
      'page reconciliation calls for eviction': { name: 'calls_for_eviction' },

      'fast-path pages deleted': {
        name: 'deleted_pages',
        label: { type: 'fast-path' }
      },
      'pages deleted': { name: 'deleted_pages' }
    }
  },

  {
    metric_name: 'wt_session_object_compactions',
    type: 'gauge',
    action: Read,
    path: ['wiredTiger', 'session', 'object compaction']
  },

  {
    metric_name: 'wt_transaction_update_conflicts',
    type: 'gauge',
    action: Read,
    path: ['wiredTiger', 'transaction', 'update conflicts']
  },

  // Database Stats

  {
    metric_name: 'db_collections_count',
    type: 'gauge',
    action: Read,
    path: 'collections'
  },

  {
    metric_name: 'db_views_count',
    type: 'gauge',
    action: Read,
    path: 'views'
  },

  {
    metric_name: 'db_indexes_count',
    type: 'gauge',
    action: Read,
    path: 'indexes'
  },

  {
    metric_name: 'db_objects_count',
    type: 'gauge',
    action: Read,
    path: 'objects'
  },

  {
    metric_name: 'db_num_extents',
    type: 'gauge',
    action: Read,
    path: 'numExtents'
  },

  {
    metric_name: 'db_disk_used',
    type: 'gauge',
    action: Read,
    path: 'fsUsedSize'
  },

  {
    metric_name: 'db_disk_size',
    type: 'gauge',
    action: Read,
    path: 'fsTotalSize'
  },

  {
    metric_name: 'db_data_size',
    type: 'gauge',
    action: Read,
    path: 'dataSize'
  },

  {
    metric_name: 'db_index_size',
    type: 'gauge',
    action: Read,
    path: 'indexSize'
  },

  {
    metric_name: 'reads_latency',
    type: 'histogram',
    action: ReadHistogram,
    path: 'reads'
  },

  {
    metric_name: 'writes_latency',
    type: 'histogram',
    action: ReadHistogram,
    path: 'writes'
  },

  {
    metric_name: 'commands_latency',
    type: 'histogram',
    action: ReadHistogram,
    path: 'commands'
  }
]

const allMetrics = {}

class Metric {
  constructor (name, type) {
    this.name = name
    this.type = type
    this.map = []
    this.root = undefined

    // this.help = ''
    // this.url = ''
  }

  add (type, rule) {
    if (this.type === undefined) {
      this.type = type
    } else if (this.type !== type) {
      throw new Error(
        `${this.name} type mismatch. Got ${type}, but already defined as ${
          this.type
        } in ${util.inspect(rule)}`
      )
    }

    this.map.push(rule)
  }
}

function get (name, type) {
  let metric = allMetrics[name]

  if (!metric) {
    metric = new Metric(name, type)
    allMetrics[name] = metric
  }

  return metric
}

for (const rule of config) {
  switch (rule.action) {
    case Read:
      get(rule.metric_name).add(rule.type, {
        labels: {},
        value_path: [].concat(rule.path)
      })
      break
    case RemapKeysAsMetrics:
      for (const pathKey in rule.map) {
        if (Object.prototype.hasOwnProperty.call(rule.map, pathKey)) {
          const mapRule = rule.map[pathKey]
          const metricName = [rule.metric_name, mapRule.name]
            .filter(Boolean)
            .join('_')
          const labels = mapRule.label || {}
          const type = mapRule.type || rule.default_type
          const metric = get(metricName)
          metric.root = rule.path

          metric.add(type, {
            labels: labels,
            value_path: [].concat(pathKey),
            transform: mapRule.transform
          })
        }
      }

      break
    default:
      break
  }
}

// const keys = Object.keys(allMetrics).sort()
const values = Object.values(allMetrics)
const fs = require('fs')
// const process = require('process')

for (const metric of values) {
  // process.stdout.write(JSON.stringify(metric, null, 2))
  // process.stdout.write('\n')

  const name = metric.name
  const path = ['metrics']
  const requirePath = ['metrics']
  let extraInfo = {}

  if (name.startsWith('wt_block_manager_')) {
    path.push('wt', 'block_manager')
    requirePath.push('wt', 'wt_block_manager.js')
  } else if (name.startsWith('wt_btree_')) {
    path.push('wt', 'btree')
    requirePath.push('wt', 'wt_btree.js')
  } else if (name.startsWith('wt_lsm_')) {
    path.push('wt', 'lsm')
    requirePath.push('wt', 'wt_lsm.js')
  } else if (name.startsWith('wt_cache_walk_')) {
    path.push('wt', 'cache_walk')
    requirePath.push('wt', 'wt_cache_walk.js')
  } else if (name.startsWith('wt_cache_')) {
    path.push('wt', 'cache')
    requirePath.push('wt', 'wt_cache.js')
  } else if (name.startsWith('wt_compresssion_')) {
    path.push('wt', 'compression')
    requirePath.push('wt', 'wt_compresssion.js')
  } else if (name.startsWith('wt_cursor_')) {
    path.push('wt', 'cursor')
    requirePath.push('wt', 'wt_cursor.js')
  } else if (name.startsWith('wt_reconciliation_')) {
    path.push('wt', 'reconciliation')
    requirePath.push('wt', 'wt_reconciliation.js')
  } else if (name.startsWith('wt_')) {
    path.push('wt')
    requirePath.push('wt.js')
  } else if (name.startsWith('collection_')) {
    path.push('collection')
    requirePath.push('collection.js')
  } else if (name.startsWith('db_')) {
    path.push('db')
    requirePath.push('db.js')
  } else {
    requirePath.push('all.js')
  }

  if (name.startsWith('wt_')) {
    extraInfo = {
      sources: ['serverStatus', 'collectionStats.storageStats', 'collectionStats.indexDetails']
    }
  } else if (name.startsWith('collection_')) {
    extraInfo = {
      source: ['collectionStats.storageStats']
    }
  } else if (name.startsWith('db')) {
    extraInfo = {
      sources: ['dbStats']
    }
  }

  const requireRoot = requirePath.slice(0, -1)

  fs.mkdirSync(path.join('/'), { recursive: true })
  if (requireRoot.length > 0) {
    fs.mkdirSync(requireRoot.join('/'), { recursive: true })
  }

  path.push(`${name}.json`)

  const fileName = path.join('/')
  const requireName = requirePath.join('/')
  const data = JSON.stringify(Object.assign(extraInfo, metric), null, 2)
  let action

  if (fs.existsSync(requireName)) {
    const requireLine = `Registry.createMetric(require('src/${fileName}'))\n`

    fs.appendFileSync(requireName, requireLine)

    action = 'appended'
  } else {
    const headerLine = `import Registry from 'src/registry.js'\n
Registry.createMetric(require('src/${fileName}'))\n`

    fs.writeFileSync(requireName, headerLine)

    action = 'created'
  }

  fs.writeFileSync(fileName, data)
  console.log(`${fileName} saved, ${requireName} ${action}`)
}

console.log(`Total: ${values.length} metrics`)
