# MongoDB Shell Exporter [![Build Status](https://travis-ci.org/db-ai/mongo_shell_exporter.svg?branch=master)](https://travis-ci.org/db-ai/mongo_shell_exporter)

Zero-dependency Prometheus exporter for MongoDB.

Features:

* No dependencies
* Collection & Index level metric export
* Replica Set support

Planned features:

* Sharded Cluster support
* Select metrics to be exported
* Selection of databases and collection to be exported
* More metrics!

Supported MongoDB Versions:

* 4.2.6+

It might work with other versions

## Usage

Just download mongo_exporter.js from Releases and run it with `mongo` shell.

1. `curl -L https://github.com/db-ai/mongo_shell_exporter/releases/latest/download/mongo_exporter.js > mongo_exporter.js`
2. `mongo --quiet mongo_exporter.js`

You can pass other options, like authentication, port, host or connection uri as usual.

If you are exporting data from Replica Set, most appropriate strategy is to deploy [Script Exporter](#script-exporter-recommended) on each node. Use `localhost` connection, to ensure that your are making direct connection.

## Access control

If you use [Authentication](https://docs.mongodb.com/manual/core/authentication/), then you have to add an user account:

```
    db.getSiblingDB("admin").createUser({
      user: "mongodb_exporter",
      pwd: passwordPrompt(),
      roles: [
          { role: "clusterMonitor", db: "admin" },
          { role: "read", db: "local" }
      ]
    })
```

and then you can run exporter with new credentials:

```
  mongo --quiet mongo_exporter.js --username mongodb_exporter --password
```

## Exporiting to Prometheus

You can export metrics to prometheus using one of the following methods:

### [Script Exporter](https://github.com/ricoberger/script_exporter) **(Recommended)**

Best way to export metrics from the `mongo_shell_exporter` is to install [`script_exporter`](https://github.com/ricoberger/script_exporter), and configure export task:

```
scripts:
  - name: mongo_shell_exporter
    script: mongo --quiet /path/to/mongo_exporter.js
```

Don't forget to enable authentication for your exporter.

### [Node Exporter](https://github.com/prometheus/node_exporter)

You can use [Textfile Collector] to periodically export metrics using scheduler.

Configure your scheduller to pereodically dump metrics to `--collector.textfile.directory`, for example:

```
mongo --quiet /path/to/mongo_exporter.js > /path/to/directory/mongo_shell_exporter.prom.$$
mv /path/to/directory/mongo_shell_exporter.prom.$$ /path/to/directory/mongo_shell_exporter.prom
```

**Note:** this method doesn't follow Prometheus recommendations. Read more [here](https://prometheus.io/docs/introduction/faq/#why-do-you-pull-rather-than-push)

### nc-based http *server*

You can find kind of *http server* example in `examples` folder. It uses `nc` to listen on port `9999` and return metrics each time someone is connected.

There is multiple caveats with this method as well:

1. No authentication, authorization or access control of any kind
2. `nc` implementations can differ and it might be tricky to properly configure it
