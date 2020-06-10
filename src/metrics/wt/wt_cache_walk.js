import Registry from 'src/registry.js'

Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_seen_page_size_max.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_on_disk_page_image_size_avg.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_on_disk_page_image_size_min.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_on_disk_page_image_smalled_than_unit.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_eviction_generation.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_eviction_generation_gap_avg.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_eviction_generation_gap_max.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_pages_never_visited_for_eviction.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_time_in_cache_avg.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_pages_total.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_root_page_entries_count.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_root_page_size_bytes.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_created_and_never_writtend_pages_total.json'))
Registry.createMetric(require('src/metrics/wt/cache_walk/wt_cache_walk_refs_skipped.json'))