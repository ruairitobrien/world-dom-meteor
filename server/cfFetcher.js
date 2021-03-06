Meteor.methods({
    listLiveApps: function () {
        var apps = testData.applications;//getJson("http://10.73.66.197:9200/stains/application/1", '_source.applications');
        return populateDependencies(apps, apps);
    },
    listSpaces: function () {
        var spaces = testData.spaces;//getJson("http://10.73.66.197:9200/stains/pcfSpace/1", '_source.spaces');
        return spaces;
    },
    listServices: function () {
        var services = testData.services;//getJson("http://10.73.66.197:9200/stains/service/1", '_source.services');
        return services;
    },
    fetchProducts: function () {
        return testData.products;//getJson("http://10.73.66.197:9200/stains/product/_search");
    },
    fetchProduct: function (id) {
        return {};//getJson("http://10.73.66.197:9200/stains/devProject/_search?q=product:"+id);
    },
    fetchProjects: function () {
        return testData.project; //getJson("http://10.73.66.197:9200/stains/devProject/_search");
    },
    fetchProject: function (id) {
        return {}; //getJson("http://10.73.66.197:9200/stains/devProject/_search?" + id);
    }
});

var getJson = function (url, path) {
    //synchronous GET
    var result = Meteor.http.get(url, {timeout: 30000});
    if (result.statusCode == 200) {
        var result = JSON.parse(result.content);

        if (path) {
            var nodes = path.split('.');
            var currentNode = _.clone(result);
            for (var i = 0; i < nodes.length; i++) {
                currentNode = currentNode[nodes[i]];
            }
            result = currentNode;
        }

        return result;
    } else {
        console.log("Response issue: ", result.statusCode);
        var errorJson = JSON.parse(result.content);
        throw new Meteor.Error(result.statusCode, errorJson.error);
    }
};

var populateDependencies = function (apps, allApps) {
    var populatedApps = [];
    _.each(apps, function (app) {

        if (!app.populated && !app.dependencies) {
            try {
                var originalApp = _.find(allApps, function (orgApp) {
                    return orgApp.project === app.name || orgApp.project === app.project;
                });
                app = originalApp;
            } catch (err) {
                console.log(err);
            }
        }

        if (app && !app.populated && app.dependencies) {
            // Remove duplicates
            app.dependencies = _.uniq(app.dependencies, function (x) {
                return x.name;
            });

            var populatedDependencies = [];

            _.each(app.dependencies, function (dependency) {
                var populated = _.find(allApps, function (check) {
                    return check.project === dependency.name || check.project === dependency.project;
                });
                app.dependencies = populateDependencies(app.dependencies, allApps);
                populatedDependencies.push(populated);
            });

            app.dependencies = populatedDependencies;
            app.populated = true;
            populatedApps.push(app);
        }

    });
    if (populatedApps && populatedApps.length > 0) {
        return populatedApps;
    } else {
        return apps;
    }
};

var testData = {
    "spaces": [{
        "organization": {
            "billingEnabled": false,
            "name": "titan",
            "meta": {"created": 1414426816000, "updated": 1414510620000, "guid": "f333fece-5ad5-462c-8184-d295304198f2"}
        },
        "name": "development",
        "meta": {"created": 1414426845000, "updated": null, "guid": "d2258adb-3391-48d0-b039-3a9c1423ae46"}
    }, {
        "organization": {
            "billingEnabled": false,
            "name": "titan",
            "meta": {"created": 1414426816000, "updated": 1414510620000, "guid": "f333fece-5ad5-462c-8184-d295304198f2"}
        },
        "name": "CIT",
        "meta": {"created": 1414426862000, "updated": null, "guid": "ecb5f992-bb71-443a-9d14-b9b937023646"}
    }, {
        "organization": {
            "billingEnabled": false,
            "name": "titan",
            "meta": {"created": 1414426816000, "updated": 1414510620000, "guid": "f333fece-5ad5-462c-8184-d295304198f2"}
        },
        "name": "QA",
        "meta": {"created": 1414426901000, "updated": null, "guid": "6cb1cb9a-cc39-4893-b212-59bb5375758e"}
    }],
    "applications": [{
        "project": "cronus-analysis-configuration",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-cronus-analysis-configuration",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-cronus-analysis-configuration.apps.titan.lab.emc.com"],
        "services": ["dev-cronus-analysis-configuration-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-task-tracking",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-titan-task-tracking",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-titan-task-tracking.apps.titan.lab.emc.com"],
        "services": ["dev-titan-task-tracking-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "madded1-cronus-analysis-configuration",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "madded1-cronus-analysis-configuration",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["madded1-cronus-analysis-configuration.apps.titan.lab.emc.com"],
        "services": ["madded1-cronus-analysis-configuration-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-raw-data-management",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-titan-raw-data-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-titan-raw-data-management.apps.titan.lab.emc.com"],
        "services": ["dev-titan-raw-data-management-mysql", "dev-titan-raw-data-management-riak"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-user-management",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-titan-user-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-titan-user-management.apps.titan.lab.emc.com"],
        "services": ["dev-titan-user-management-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-data-management",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-titan-data-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-titan-data-management.apps.titan.lab.emc.com"],
        "services": ["dev-titan-data-management-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-stubs",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "dev-cronus-stubs",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-cronus-stubs.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-index",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-cronus-index",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-cronus-index.apps.titan.lab.emc.com"],
        "services": ["dev-cronus-index-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-upload-processing",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-cronus-upload-processing",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-cronus-upload-processing.apps.titan.lab.emc.com"],
        "services": ["dev-cronus-upload-processing-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-raw-data-management",
            "url": "rawdataUrl=http://cit-titan-raw-data-management.apps.titan.lab.emc.com/rawdata/"
        }, {
            "name": "cronus-index",
            "url": "indexServiceUrl=http://cit-cronus-index.apps.titan.lab.emc.com/"
        }, {
            "name": "cronus-analysis-configuration",
            "url": "analysisConfigurationUrl=http://cit-cronus-analysis-configuration.apps.titan.lab.emc.com/"
        }]
    }, {
        "project": "cronus-ingestion",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-cronus-ingestion",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-cronus-ingestion.apps.titan.lab.emc.com"],
        "services": ["dev-cronus-ingestion-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-raw-data-management",
            "url": "rawdataUrl=http://cit-titan-raw-data-management.apps.titan.lab.emc.com/rawdata"
        }, {
            "name": "cronus-index",
            "url": "indexServiceUrl=http://dev-cronus-index.apps.titan.lab.emc.com/"
        }, {
            "name": "cronus-upload-processing",
            "url": "fileSetAnalysisUrl=http://dev-cronus-upload-processing.apps.titan.lab.emc.com/fileSetAnalysis/"
        }, {
            "name": "titan-task-tracking",
            "url": "taskUrl=http://cit-titan-task-tracking.apps.titan.lab.emc.com/tasks/"
        }, {
            "name": "titan-task-tracking",
            "url": "stepUrl=http://cit-titan-task-tracking.apps.titan.lab.emc.com/steps/"
        }, {
            "name": "titan-data-management",
            "url": "projectsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/projects/"
        }]
    }, {
        "project": "croneight",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/cloudfoundry-community/nginx-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "croneight",
        "memory": 128,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["croneight.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-data-integration",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-titan-data-integration",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-titan-data-integration.apps.titan.lab.emc.com"],
        "services": ["dev-titan-data-integration-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "connoj14-titan-data-management",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "connoj14-titan-data-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["connoj14-titan-data-management.apps.titan.lab.emc.com"],
        "services": ["connoj14-titan-data-management-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-datamanagement-wrapper",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dev-cronus-datamanagement-wrapper",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-cronus-datamanagement-wrapper.apps.titan.lab.emc.com"],
        "services": ["dev-cronus-datamanagement-wrapper-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-data-management",
            "url": "clientsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/clients/"
        }, {
            "name": "titan-data-management",
            "url": "clientEngagementsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/clientengagements/"
        }, {
            "name": "titan-data-management",
            "url": "projectsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/projects/"
        }, {"name": "cronus-ingestion", "url": "ingestionUrl=http://cit-cronus-ingestion.apps.titan.lab.emc.com/"}]
    }, {
        "project": "obrier3-cronus-ingestion",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "obrier3-cronus-ingestion",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["obrier3-cronus-ingestion.apps.titan.lab.emc.com"],
        "services": ["obrier3-cronus-ingestion-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-raw-data-management",
            "url": "rawdataUrl=http://cit-titan-raw-data-management.apps.titan.lab.emc.com/rawdata"
        }, {
            "name": "cronus-index",
            "url": "indexServiceUrl=http://cit-cronus-index.apps.titan.lab.emc.com/"
        }, {
            "name": "cronus-upload-processing",
            "url": "fileSetAnalysisUrl=http://cit-cronus-upload-processing.apps.titan.lab.emc.com/fileSetAnalysis/"
        }, {
            "name": "titan-task-tracking",
            "url": "taskUrl=http://cit-titan-task-tracking.apps.titan.lab.emc.com/tasks/"
        }, {
            "name": "titan-task-tracking",
            "url": "stepUrl=http://cit-titan-task-tracking.apps.titan.lab.emc.com/steps/"
        }, {
            "name": "titan-data-management",
            "url": "projectsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/projects/"
        }]
    }, {
        "project": "dillos-login",
        "space": "development",
        "staging": {"stack": "lucid64", "healthCheckTimeout": null, "buildpackUrl": null, "command": null},
        "instances": 1,
        "name": "dillos-login",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dillos-login.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "dillos-uaa",
        "space": "development",
        "staging": {"stack": "lucid64", "healthCheckTimeout": null, "buildpackUrl": null, "command": null},
        "instances": 1,
        "name": "dillos-uaa",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dillos-uaa.apps.titan.lab.emc.com"],
        "services": ["dillos-uaa-db"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "wojcij1-dummy-app",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "wojcij1-dummy-app",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["wojcij1-dummy-app.apps.titan.lab.emc.com"],
        "services": ["wojcij1-dummy-app-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "dillos-cronus-ingestion",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dillos-cronus-ingestion",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dillos-cronus-ingestion.apps.titan.lab.emc.com"],
        "services": ["dillos-cronus-ingestion-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "dillos-titan-raw-data-management",
            "url": "rawdataUrl=http://dillos-titan-raw-data-management.apps.titan.lab.emc.com/rawdata"
        }, {
            "name": "cronus-index",
            "url": "indexServiceUrl=http://dev-cronus-index.apps.titan.lab.emc.com/"
        }, {
            "name": "cronus-upload-processing",
            "url": "fileSetAnalysisUrl=http://dev-cronus-upload-processing.apps.titan.lab.emc.com/fileSetAnalysis/"
        }, {
            "name": "dillos-titan-task-tracking",
            "url": "taskUrl=http://dillos-titan-task-tracking.apps.titan.lab.emc.com/tasks/"
        }, {
            "name": "dillos-titan-task-tracking",
            "url": "stepUrl=http://dillos-titan-task-tracking.apps.titan.lab.emc.com/steps/"
        }]
    }, {
        "project": "dillos-titan-task-tracking",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dillos-titan-task-tracking",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dillos-titan-task-tracking.apps.titan.lab.emc.com"],
        "services": ["dillos-titan-task-tracking-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "dillos-titan-raw-data-management",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "dillos-titan-raw-data-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dillos-titan-raw-data-management.apps.titan.lab.emc.com"],
        "services": ["dillos-titan-raw-data-management-mysql", "dillos-titan-raw-data-management-riak"],
        "profiles": null,
        "dependencies": [{"name": "10.73.67.57/tasks/", "url": "taskUrl=http://10.73.67.57/tasks/"}]
    }, {
        "project": "dummy-app",
        "space": "development",
        "staging": {"stack": "lucid64", "healthCheckTimeout": null, "buildpackUrl": null, "command": null},
        "instances": 1,
        "name": "dummy-app",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dummy-app.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "oneils6-dummy-app",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "oneils6-dummy-app",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["oneils6-dummy-app.apps.titan.lab.emc.com"],
        "services": ["oneils6-dummy-app-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "psappsteamcity-cronus-index",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "psappsteamcity-cronus-index",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["psappsteamcity-cronus-index.apps.titan.lab.emc.com"],
        "services": ["psappsteamcity-cronus-index-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "dev-cronus",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-cronus.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "dev-titan",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-titan.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "basic-vplex-sizer",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "dev-basic-vplex-sizer",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-basic-vplex-sizer.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "barrel1-dummy-app",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "barrel1-dummy-app",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["barrel1-dummy-app.apps.titan.lab.emc.com"],
        "services": ["barrel1-dummy-app-mongo", "barrel1-dummy-app-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "odonom2-cronus-ingestion",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "odonom2-cronus-ingestion",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["odonom2-cronus-ingestion.apps.titan.lab.emc.com"],
        "services": ["odonom2-cronus-ingestion-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-raw-data-management",
            "url": "rawdataUrl=http://cit-titan-raw-data-management.apps.titan.lab.emc.com/rawdata"
        }, {
            "name": "cronus-index",
            "url": "indexServiceUrl=http://dev-cronus-index.apps.titan.lab.emc.com/"
        }, {
            "name": "cronus-upload-processing",
            "url": "fileSetAnalysisUrl=http://dev-cronus-upload-processing.apps.titan.lab.emc.com/fileSetAnalysis/"
        }, {
            "name": "titan-task-tracking",
            "url": "taskUrl=http://cit-titan-task-tracking.apps.titan.lab.emc.com/tasks/"
        }, {
            "name": "titan-task-tracking",
            "url": "stepUrl=http://cit-titan-task-tracking.apps.titan.lab.emc.com/steps/"
        }, {
            "name": "titan-data-management",
            "url": "projectsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/projects/"
        }]
    }, {
        "project": "basic-vplex-sizer-stubs",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "dev-basic-vplex-sizer-stubs",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["dev-basic-vplex-sizer-stubs.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "moriaa1-titan-application-authorization",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "moriaa1-titan-application-authorization",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["moriaa1-titan-application-authorization.apps.titan.lab.emc.com"],
        "services": ["moriaa1-titan-application-authorization-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "stains",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/cloudfoundry-community/nginx-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "stains",
        "memory": 128,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["stains.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "stains-meteor",
        "space": "development",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/cloudfoundry-community/cloudfoundry-buildpack-meteorite.git",
            "command": null
        },
        "instances": 1,
        "name": "stains-meteor",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["stains-meteor.apps.titan.lab.emc.com"],
        "services": ["stains-meteor-mongo"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "elastics",
        "space": "development",
        "staging": {"stack": "lucid64", "healthCheckTimeout": null, "buildpackUrl": null, "command": null},
        "instances": 1,
        "name": "elastics",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["elastics.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "basic-vplex-sizer-app",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-basic-vplex-sizer-app",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-basic-vplex-sizer-app.apps.titan.lab.emc.com"],
        "services": ["cit-basic-vplex-sizer-app-redis"],
        "profiles": null,
        "dependencies": [{
            "name": "vplex-replication-sizing",
            "url": "replicationSizingUrl=http://cit-vplex-replication-sizing.apps.titan.lab.emc.com/vplexreplicationsizing/"
        }, {
            "name": "sizer-risk-assessment",
            "url": "riskAssessmentUrl=http://cit-sizer-risk-assessment.apps.titan.lab.emc.com/vplexriskassessment/"
        }, {
            "name": "sizer-workload-management",
            "url": "workloadManagementUrl=http://cit-sizer-workload-management.apps.titan.lab.emc.com/workloadmanagement/"
        }]
    }, {
        "project": "basic-vplex-sizer-ref-data",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-basic-vplex-sizer-ref-data",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-basic-vplex-sizer-ref-data.apps.titan.lab.emc.com"],
        "services": ["cit-basic-vplex-sizer-ref-data-mongo"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "sizer-risk-assessment",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-sizer-risk-assessment",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-sizer-risk-assessment.apps.titan.lab.emc.com"],
        "services": ["cit-sizer-risk-assessment-redis"],
        "profiles": null,
        "dependencies": [{
            "name": "basic-vplex-sizer-ref-data",
            "url": "refDataUrl=http://cit-basic-vplex-sizer-ref-data.apps.titan.lab.emc.com/vplexreferencedata/"
        }]
    }, {
        "project": "sizer-workload-management",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-sizer-workload-management",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-sizer-workload-management.apps.titan.lab.emc.com"],
        "services": ["cit-sizer-workload-management-mysql", "cit-sizer-workload-management-redis"],
        "profiles": null,
        "dependencies": [{
            "name": "basic-vplex-sizer-ref-data",
            "url": "refDataUrl=http://cit-basic-vplex-sizer-ref-data.apps.titan.lab.emc.com/vplexreferencedata/"
        }]
    }, {
        "project": "vplex-replication-sizing",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-vplex-replication-sizing",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-vplex-replication-sizing.apps.titan.lab.emc.com"],
        "services": ["cit-vplex-replication-sizing-redis"],
        "profiles": null,
        "dependencies": [{
            "name": "sizer-workload-management",
            "url": "workloadProfilerUrl=http://cit-sizer-workload-management.apps.titan.lab.emc.com/workloadprofiler/"
        }]
    }, {
        "project": "titan-task-tracking",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-titan-task-tracking",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-titan-task-tracking.apps.titan.lab.emc.com"],
        "services": ["cit-titan-task-tracking-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-raw-data-management",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-titan-raw-data-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-titan-raw-data-management.apps.titan.lab.emc.com"],
        "services": ["cit-titan-raw-data-management-mysql", "cit-titan-raw-data-management-riak"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-data-management",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-titan-data-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-titan-data-management.apps.titan.lab.emc.com"],
        "services": ["cit-titan-data-management-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "cit-cronus",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-cronus.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "webui-design-guide",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "webui-design-guide",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["webui-design-guide.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-index-service",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-cronus-index-service",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-cronus-index-service.apps.titan.lab.emc.com"],
        "services": ["cit-cronus-index-service-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-analysis-configuration",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-cronus-analysis-configuration",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-cronus-analysis-configuration.apps.titan.lab.emc.com"],
        "services": ["cit-cronus-analysis-configuration-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-ingestion",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-cronus-ingestion",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-cronus-ingestion.apps.titan.lab.emc.com"],
        "services": ["cit-cronus-ingestion-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-raw-data-management",
            "url": "rawdataUrl=http://cit-titan-raw-data-management.apps.titan.lab.emc.com/rawdata"
        }, {
            "name": "cronus-index",
            "url": "indexServiceUrl=http://cit-cronus-index.apps.titan.lab.emc.com/"
        }, {
            "name": "cronus-upload-processing",
            "url": "fileSetAnalysisUrl=http://cit-cronus-upload-processing.apps.titan.lab.emc.com/fileSetAnalysis/"
        }, {
            "name": "titan-task-tracking",
            "url": "taskUrl=http://cit-titan-task-tracking.apps.titan.lab.emc.com/tasks/"
        }, {
            "name": "titan-task-tracking",
            "url": "stepUrl=http://cit-titan-task-tracking.apps.titan.lab.emc.com/steps/"
        }, {
            "name": "titan-data-management",
            "url": "projectsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/projects/"
        }]
    }, {
        "project": "cronus-index",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-cronus-index",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-cronus-index.apps.titan.lab.emc.com"],
        "services": ["cit-cronus-index-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-upload-processing",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-cronus-upload-processing",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-cronus-upload-processing.apps.titan.lab.emc.com"],
        "services": ["cit-cronus-upload-processing-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-raw-data-management",
            "url": "rawdataUrl=http://cit-titan-raw-data-management.apps.titan.lab.emc.com/rawdata/"
        }, {
            "name": "cronus-index",
            "url": "indexServiceUrl=http://cit-cronus-index.apps.titan.lab.emc.com/"
        }, {
            "name": "cronus-analysis-configuration",
            "url": "analysisConfigurationUrl=http://cit-cronus-analysis-configuration.apps.titan.lab.emc.com/"
        }]
    }, {
        "project": "titan-user-management",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-titan-user-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-titan-user-management.apps.titan.lab.emc.com"],
        "services": ["cit-titan-user-management-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-data-integration",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-titan-data-integration",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-titan-data-integration.apps.titan.lab.emc.com"],
        "services": ["cit-titan-data-integration-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-datamanagement-wrapper",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "cit-cronus-datamanagement-wrapper",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-cronus-datamanagement-wrapper.apps.titan.lab.emc.com"],
        "services": ["cit-cronus-datamanagement-wrapper-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-data-management",
            "url": "clientsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/clients/"
        }, {
            "name": "titan-data-management",
            "url": "clientEngagementsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/clientengagements/"
        }, {
            "name": "titan-data-management",
            "url": "projectsUrl=http://cit-titan-data-management.apps.titan.lab.emc.com/projects/"
        }, {"name": "cronus-ingestion", "url": "ingestionUrl=http://cit-cronus-ingestion.apps.titan.lab.emc.com/"}]
    }, {
        "project": "basic-vplex-sizer",
        "space": "CIT",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "cit-basic-vplex-sizer",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["cit-basic-vplex-sizer.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-task-tracking",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-titan-task-tracking",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-titan-task-tracking.apps.titan.lab.emc.com"],
        "services": ["qa-titan-task-tracking-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "basic-vplex-sizer",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "qa-basic-vplex-sizer",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-basic-vplex-sizer.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "basic-vplex-sizer-ref-data",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-basic-vplex-sizer-ref-data",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-basic-vplex-sizer-ref-data.apps.titan.lab.emc.com"],
        "services": ["qa-basic-vplex-sizer-ref-data-mongo"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "sizer-risk-assessment",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-sizer-risk-assessment",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-sizer-risk-assessment.apps.titan.lab.emc.com"],
        "services": ["qa-sizer-risk-assessment-redis"],
        "profiles": null,
        "dependencies": [{
            "name": "basic-vplex-sizer-ref-data",
            "url": "refDataUrl=http://qa-basic-vplex-sizer-ref-data.apps.titan.lab.emc.com/vplexreferencedata/"
        }]
    }, {
        "project": "vplex-replication-sizing",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-vplex-replication-sizing",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-vplex-replication-sizing.apps.titan.lab.emc.com"],
        "services": ["qa-vplex-replication-sizing-redis"],
        "profiles": null,
        "dependencies": [{
            "name": "sizer-workload-management",
            "url": "workloadProfilerUrl=http://qa-sizer-workload-management.apps.titan.lab.emc.com/workloadprofiler/"
        }]
    }, {
        "project": "basic-vplex-sizer-app",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-basic-vplex-sizer-app",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-basic-vplex-sizer-app.apps.titan.lab.emc.com"],
        "services": ["qa-basic-vplex-sizer-app-redis"],
        "profiles": null,
        "dependencies": [{
            "name": "vplex-replication-sizing",
            "url": "replicationSizingUrl=http://qa-vplex-replication-sizing.apps.titan.lab.emc.com/vplexreplicationsizing/"
        }, {
            "name": "sizer-risk-assessment",
            "url": "riskAssessmentUrl=http://qa-sizer-risk-assessment.apps.titan.lab.emc.com/vplexriskassessment/"
        }, {
            "name": "sizer-workload-management",
            "url": "workloadManagementUrl=http://qa-sizer-workload-management.apps.titan.lab.emc.com/workloadmanagement/"
        }]
    }, {
        "project": "sizer-workload-management",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-sizer-workload-management",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-sizer-workload-management.apps.titan.lab.emc.com"],
        "services": ["qa-sizer-workload-management-mysql", "qa-sizer-workload-management-redis"],
        "profiles": null,
        "dependencies": [{
            "name": "basic-vplex-sizer-ref-data",
            "url": "refDataUrl=http://qa-basic-vplex-sizer-ref-data.apps.titan.lab.emc.com/vplexreferencedata/"
        }]
    }, {
        "project": "cronus",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "https://github.com/drnic/staticfile-buildpack.git",
            "command": null
        },
        "instances": 1,
        "name": "qa-cronus",
        "memory": 64,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-cronus.apps.titan.lab.emc.com"],
        "services": [],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-data-management",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-titan-data-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-titan-data-management.apps.titan.lab.emc.com"],
        "services": ["qa-titan-data-management-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "titan-raw-data-management",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-titan-raw-data-management",
        "memory": 1024,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-titan-raw-data-management.apps.titan.lab.emc.com"],
        "services": ["qa-titan-raw-data-management-mysql", "qa-titan-raw-data-management-riak"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-analysis-configuration",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-cronus-analysis-configuration",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-cronus-analysis-configuration.apps.titan.lab.emc.com"],
        "services": ["qa-cronus-analysis-configuration-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-index",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-cronus-index",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-cronus-index.apps.titan.lab.emc.com"],
        "services": ["qa-cronus-index-mysql"],
        "profiles": null,
        "dependencies": []
    }, {
        "project": "cronus-ingestion",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-cronus-ingestion",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-cronus-ingestion.apps.titan.lab.emc.com"],
        "services": ["qa-cronus-ingestion-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-raw-data-management",
            "url": "rawdataUrl=http://qa-titan-raw-data-management.apps.titan.lab.emc.com/rawdata"
        }, {
            "name": "cronus-index",
            "url": "indexServiceUrl=http://qa-cronus-index.apps.titan.lab.emc.com/"
        }, {
            "name": "cronus-upload-processing",
            "url": "fileSetAnalysisUrl=http://qa-cronus-upload-processing.apps.titan.lab.emc.com/fileSetAnalysis/"
        }, {
            "name": "titan-task-tracking",
            "url": "taskUrl=http://qa-titan-task-tracking.apps.titan.lab.emc.com/tasks/"
        }, {
            "name": "titan-task-tracking",
            "url": "stepUrl=http://qa-titan-task-tracking.apps.titan.lab.emc.com/steps/"
        }]
    }, {
        "project": "cronus-upload-processing",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-cronus-upload-processing",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-cronus-upload-processing.apps.titan.lab.emc.com"],
        "services": ["qa-cronus-upload-processing-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-raw-data-management",
            "url": "rawdataUrl=http://qa-titan-raw-data-management.apps.titan.lab.emc.com/rawdata/"
        }, {
            "name": "cronus-index",
            "url": "indexServiceUrl=http://qa-cronus-index.apps.titan.lab.emc.com/"
        }, {
            "name": "cronus-analysis-configuration",
            "url": "analysisConfigurationUrl=http://qa-cronus-analysis-configuration.apps.titan.lab.emc.com/"
        }]
    }, {
        "project": "cronus-datamanagement-wrapper",
        "space": "QA",
        "staging": {
            "stack": "lucid64",
            "healthCheckTimeout": null,
            "buildpackUrl": "java8_buildpack_offline",
            "command": null
        },
        "instances": 1,
        "name": "qa-cronus-datamanagement-wrapper",
        "memory": 512,
        "diskQuota": 1024,
        "state": "STARTED",
        "uris": ["qa-cronus-datamanagement-wrapper.apps.titan.lab.emc.com"],
        "services": ["qa-cronus-datamanagement-wrapper-mysql"],
        "profiles": null,
        "dependencies": [{
            "name": "titan-data-management",
            "url": "clientsUrl=http://qa-titan-data-management.apps.titan.lab.emc.com/clients/"
        }, {
            "name": "titan-data-management",
            "url": "clientEngagementsUrl=http://qa-titan-data-management.apps.titan.lab.emc.com/clientengagements/"
        }, {
            "name": "titan-data-management",
            "url": "projectsUrl=http://qa-titan-data-management.apps.titan.lab.emc.com/projects/"
        }, {"name": "cronus-ingestion", "url": "ingestionUrl=http://qa-cronus-ingestion.apps.titan.lab.emc.com/"}]
    }],
    "services": [
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-redis",
            "plan": "development",
            "name": "cit-basic-vplex-sizer-app-redis",
            "meta": {
                "created": 1414493327000,
                "updated": null,
                "guid": "0f35073e-8a75-4dac-87f4-3eba1501fc7f"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mongodb",
            "plan": "development",
            "name": "cit-basic-vplex-sizer-ref-data-mongo",
            "meta": {
                "created": 1414493628000,
                "updated": null,
                "guid": "48ef5f79-4201-4837-84b1-c3f81008466c"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-redis",
            "plan": "development",
            "name": "cit-sizer-risk-assessment-redis",
            "meta": {
                "created": 1414493771000,
                "updated": null,
                "guid": "570c3bb8-9fd2-4d70-b21f-2f29223d59ae"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-sizer-workload-management-mysql",
            "meta": {
                "created": 1414493903000,
                "updated": null,
                "guid": "a3c60928-c116-4642-a63a-090dc5cc7d0d"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-redis",
            "plan": "development",
            "name": "cit-sizer-workload-management-redis",
            "meta": {
                "created": 1414493903000,
                "updated": null,
                "guid": "538e5338-bc77-4c43-9ab3-14cf3be95d9c"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-redis",
            "plan": "development",
            "name": "cit-vplex-replication-sizing-redis",
            "meta": {
                "created": 1414494050000,
                "updated": null,
                "guid": "80022d0b-04a8-4a2d-b2c0-4dae49cd6c3e"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-cronus-analysis-configuration-mysql",
            "meta": {
                "created": 1414497812000,
                "updated": null,
                "guid": "bbe7fb23-869e-4d98-9f42-11bafe84fe02"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-titan-task-tracking-mysql",
            "meta": {
                "created": 1414506136000,
                "updated": null,
                "guid": "5e8abc04-34fa-4e89-97e6-733c061c2d6b"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "qa-titan-task-tracking-mysql",
            "meta": {
                "created": 1414506293000,
                "updated": null,
                "guid": "c5660576-0eaa-4dba-ad73-6750b944fd6e"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-titan-task-tracking-mysql",
            "meta": {
                "created": 1414506983000,
                "updated": null,
                "guid": "86377361-d8a4-49ee-b3c4-049efe07e31b"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "madded1-cronus-analysis-configuration-mysql",
            "meta": {
                "created": 1414508862000,
                "updated": null,
                "guid": "4218f530-fb31-4437-a7c8-de0eb6b91056"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-titan-raw-data-management-mysql",
            "meta": {
                "created": 1414509150000,
                "updated": null,
                "guid": "af135705-b166-4bf7-8906-ef7e68aadb47"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-riakcs",
            "plan": "developer",
            "name": "dev-titan-raw-data-management-riak",
            "meta": {
                "created": 1414509151000,
                "updated": null,
                "guid": "0eaf943a-3986-4387-85d3-cfe2c79738ee"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-titan-raw-data-management-mysql",
            "meta": {
                "created": 1414509292000,
                "updated": null,
                "guid": "7ebc2101-9f0e-47a8-b14a-38d89a915815"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-riakcs",
            "plan": "developer",
            "name": "cit-titan-raw-data-management-riak",
            "meta": {
                "created": 1414509293000,
                "updated": null,
                "guid": "1a26c2b1-14e6-4dc5-a8c7-0525c1142ea6"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-titan-user-management-mysql",
            "meta": {
                "created": 1414544759000,
                "updated": null,
                "guid": "ee1aafc2-cf0e-45bc-a7e6-006148fd45be"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-titan-data-management-mysql",
            "meta": {
                "created": 1414545373000,
                "updated": null,
                "guid": "7a115204-7686-4ce9-9e01-43416a4ee404"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-rabbitmq",
            "plan": "standard",
            "name": "fairbd1-rabbitmq",
            "meta": {
                "created": 1414573167000,
                "updated": null,
                "guid": "d63936c8-7394-49a9-a5aa-987b508ad9bd"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-cronus-index-mysql",
            "meta": {
                "created": 1414599126000,
                "updated": null,
                "guid": "6d729291-b3ec-4ef5-b19d-13283078557a"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-cronus-index-service-mysql",
            "meta": {
                "created": 1414600383000,
                "updated": null,
                "guid": "299729a8-5fac-4acc-901b-364017a904fc"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-cronus-upload-processing-mysql",
            "meta": {
                "created": 1414600715000,
                "updated": null,
                "guid": "03177c4d-8d3e-4727-80a4-33fb023612df"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-cronus-analysis-configuration-mysql",
            "meta": {
                "created": 1414601095000,
                "updated": null,
                "guid": "11caa338-b850-4b55-b43f-6044387e2bbc"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-cronus-ingestion-mysql",
            "meta": {
                "created": 1414601326000,
                "updated": null,
                "guid": "212df86b-ae3b-43bb-a4a4-fa49776c69e0"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-cronus-ingestion-mysql",
            "meta": {
                "created": 1414601940000,
                "updated": null,
                "guid": "34437f75-e6dc-4746-960f-eea621fa8c25"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-cronus-index-mysql",
            "meta": {
                "created": 1414618256000,
                "updated": null,
                "guid": "834c8b9c-60a3-4950-b363-c113e43554ac"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-cronus-upload-processing-mysql",
            "meta": {
                "created": 1414620656000,
                "updated": null,
                "guid": "883fd815-954b-4387-b822-cc7d8b6649e8"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-titan-user-management-mysql",
            "meta": {
                "created": 1414677674000,
                "updated": null,
                "guid": "39e62280-f338-4757-9353-a829575b71d1"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-titan-data-integration-mysql",
            "meta": {
                "created": 1414680635000,
                "updated": null,
                "guid": "737db6e6-d012-4f93-b2d9-62c8e59f30a0"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-titan-data-integration-mysql",
            "meta": {
                "created": 1414718533000,
                "updated": null,
                "guid": "6a1a4eea-0c56-46c6-817e-be8d91ce93ac"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "connoj14-titan-data-management-mysql",
            "meta": {
                "created": 1415121213000,
                "updated": null,
                "guid": "3b137b60-0be6-4408-a02a-e717f9ff43f8"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mongodb",
            "plan": "development",
            "name": "qa-basic-vplex-sizer-ref-data-mongo",
            "meta": {
                "created": 1415289536000,
                "updated": null,
                "guid": "21e1dcaf-ca8d-4700-a443-54a529ccb026"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-redis",
            "plan": "development",
            "name": "qa-sizer-risk-assessment-redis",
            "meta": {
                "created": 1415289669000,
                "updated": null,
                "guid": "d61e0727-4eb7-407f-a479-9cd6e143ffbc"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-redis",
            "plan": "development",
            "name": "qa-vplex-replication-sizing-redis",
            "meta": {
                "created": 1415289815000,
                "updated": null,
                "guid": "8b6315a5-2fd5-4f99-b491-d540f3700193"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-redis",
            "plan": "development",
            "name": "qa-basic-vplex-sizer-app-redis",
            "meta": {
                "created": 1415289960000,
                "updated": null,
                "guid": "5a9be4b0-9641-4aee-bd34-8593c6df435b"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "qa-sizer-workload-management-mysql",
            "meta": {
                "created": 1415290268000,
                "updated": null,
                "guid": "33da016b-6dc5-43ed-b130-8b3a6d1e69d6"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-redis",
            "plan": "development",
            "name": "qa-sizer-workload-management-redis",
            "meta": {
                "created": 1415290268000,
                "updated": null,
                "guid": "8112a7ef-4de9-4d65-a2f4-077a6936b4d1"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "fairbd1-titan-task-tracking-mysql",
            "meta": {
                "created": 1415353070000,
                "updated": null,
                "guid": "d129db64-d110-4932-8d9b-d3b198dbd00f"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "oneils6-dummy-app-mysql",
            "meta": {
                "created": 1415363633000,
                "updated": null,
                "guid": "d55e9df9-e53e-4b0c-9d99-9b6b706be95b"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dev-cronus-datamanagement-wrapper-mysql",
            "meta": {
                "created": 1415372239000,
                "updated": null,
                "guid": "2b66f91b-85e0-41a7-8576-808f3588a60b"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "obrier3-cronus-ingestion-mysql",
            "meta": {
                "created": 1415372526000,
                "updated": null,
                "guid": "15333f4b-22b9-4144-8d32-0653868c8cff"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dusosl-cronus-upload-processing-mysql",
            "meta": {
                "created": 1415621814000,
                "updated": null,
                "guid": "9ef486e6-3f6b-4836-ba69-49bfca32b0f9"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-cronus-datamanagement-wrapper-mysql",
            "meta": {
                "created": 1415651055000,
                "updated": null,
                "guid": "96b34e06-35a5-4ae1-b877-8f2711c9846a"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dillos-uaa-db",
            "meta": {
                "created": 1415724564000,
                "updated": null,
                "guid": "03b83512-bfac-434f-9a25-dc5463397508"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "odonom2-cronus-datamanagement-wrapper-mysql",
            "meta": {
                "created": 1415789035000,
                "updated": null,
                "guid": "ade71fa2-f250-4b84-a6ed-c4c15aaddabe"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "fairbd1-titan-data-integration-mysql",
            "meta": {
                "created": 1415803214000,
                "updated": null,
                "guid": "8300fade-5c9b-40ae-8a8f-56422044946c"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "wojcij1-dummy-app-mysql",
            "meta": {
                "created": 1416413571000,
                "updated": null,
                "guid": "267fa288-0160-40fe-ba25-866a0ef3f7ca"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dillos-cronus-ingestion-mysql",
            "meta": {
                "created": 1416418315000,
                "updated": null,
                "guid": "33a16a59-ecb0-437e-be54-b62b320e7537"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "cit-titan-data-management-mysql",
            "meta": {
                "created": 1416489842000,
                "updated": null,
                "guid": "ddc6eb23-d9fc-430f-873f-406a72def3ac"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dillos-titan-task-tracking-mysql",
            "meta": {
                "created": 1416568303000,
                "updated": null,
                "guid": "4f877c4d-284c-4271-b0f6-5af86c51e059"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "dillos-titan-raw-data-management-mysql",
            "meta": {
                "created": 1416570327000,
                "updated": null,
                "guid": "920a4447-03d4-46d8-8765-8dd3320a1c31"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-riakcs",
            "plan": "developer",
            "name": "dillos-titan-raw-data-management-riak",
            "meta": {
                "created": 1416570329000,
                "updated": null,
                "guid": "fb85c9ee-b328-4c4a-86b1-b653c9bfd3aa"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "qa-titan-data-management-mysql",
            "meta": {
                "created": 1416929108000,
                "updated": null,
                "guid": "d5b495cb-db20-4f06-8ffc-2b463c29a89c"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "qa-titan-raw-data-management-mysql",
            "meta": {
                "created": 1416930895000,
                "updated": null,
                "guid": "6b05ec1c-8502-4e60-bbeb-c21a0dead5ed"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-riakcs",
            "plan": "developer",
            "name": "qa-titan-raw-data-management-riak",
            "meta": {
                "created": 1416930896000,
                "updated": null,
                "guid": "5a629a80-86db-4bbe-a894-015560342858"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "qa-cronus-analysis-configuration-mysql",
            "meta": {
                "created": 1417021726000,
                "updated": null,
                "guid": "8af6ebd3-2587-4895-885d-b9e004b3b3a3"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "psappsteamcity-cronus-index-mysql",
            "meta": {
                "created": 1417022668000,
                "updated": null,
                "guid": "62f06766-30c9-4e9f-99eb-00e0badd8f41"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "qa-cronus-index-mysql",
            "meta": {
                "created": 1417023579000,
                "updated": null,
                "guid": "337399ec-737f-4276-be71-e854a70f1533"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "qa-cronus-ingestion-mysql",
            "meta": {
                "created": 1417023730000,
                "updated": null,
                "guid": "98da653c-a3e9-470c-b290-288fd6d73bfa"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "qa-cronus-upload-processing-mysql",
            "meta": {
                "created": 1417024022000,
                "updated": null,
                "guid": "d901114f-41ba-48bc-9289-118de2f76fd2"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "qa-cronus-datamanagement-wrapper-mysql",
            "meta": {
                "created": 1417024160000,
                "updated": null,
                "guid": "a6d77431-3f4f-41a9-9ac5-6cbedfd41d8e"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mongodb",
            "plan": "development",
            "name": "barrel1-dummy-app-mongo",
            "meta": {
                "created": 1417091932000,
                "updated": null,
                "guid": "049a87f1-f005-49a0-9f5c-52b7722e578c"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "barrel1-dummy-app-mysql",
            "meta": {
                "created": 1417091934000,
                "updated": null,
                "guid": "c9b3b373-819b-40a2-9e27-9c897d6d41db"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "odonom2-cronus-ingestion-mysql",
            "meta": {
                "created": 1417106646000,
                "updated": null,
                "guid": "7a4eb812-aedd-4a41-a1b0-ce9fbbeaed96"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mysql",
            "plan": "2000mb-dev",
            "name": "moriaa1-titan-application-authorization-mysql",
            "meta": {
                "created": 1417168329000,
                "updated": null,
                "guid": "69553f9f-a42b-469b-b97d-809fda5e9d01"
            }
        },
        {
            "version": null,
            "provider": null,
            "userProvided": false,
            "label": "p-mongodb",
            "plan": "development",
            "name": "stains-meteor-mongo",
            "meta": {
                "created": 1417180574000,
                "updated": null,
                "guid": "fbf1b065-ed75-462e-8a75-7bb51985eb26"
            }
        }
    ],
    "products": {
        "took": 2,
        "timed_out": false,
        "_shards": {
            "total": 5,
            "successful": 5,
            "failed": 0
        },
        "hits": {
            "total": 7,
            "max_score": 1.0,
            "hits": [
                {
                    "_index": "stains",
                    "_type": "product",
                    "_id": "Sizing",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "Sizing",
                            "jira": {
                                "projectName": "SIZ",
                                "currentP0Count": "9"
                            }
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "product",
                    "_id": "Test",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 00:09:50 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "Test"
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "product",
                    "_id": "The Elastics",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 00:09:50 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "The Elastics"
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "product",
                    "_id": "Titan",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "Titan",
                            "jira": {
                                "projectName": "TINA",
                                "currentP0Count": "10"
                            }
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "product",
                    "_id": "Stains the Dog",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 00:09:50 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "Stains the Dog"
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "product",
                    "_id": "Web UI Framework",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 00:09:50 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "Web UI Framework"
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "product",
                    "_id": "Cronus",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "Cronus",
                            "jira": {
                                "projectName": "CRONUS",
                                "currentP0Count": "14"
                            }
                        }
                    }
                }
            ]
        }
    },
    "devProject": {
        "took": 1,
        "timed_out": false,
        "_shards": {
            "total": 5,
            "successful": 5,
            "failed": 0
        },
        "hits": {
            "total": 50,
            "max_score": 1.0,
            "hits": [
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "generator-titan-ui",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 00:09:51 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "generator-titan-ui",
                            "link": "http://10.73.71.154:7990/scm/ui/generator-titan-ui.git",
                            "product": "Web UI Framework",
                            "warnings": [],
                            "dependencies": [],
                            "children": [],
                            "testDependencies": []
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "cronus-cloveretl-poc",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "cronus-cloveretl-poc",
                            "link": "http://10.73.71.154:7990/scm/cron/cronus-cloveretl-poc.git",
                            "product": "Cronus",
                            "warnings": [],
                            "dependencies": [],
                            "children": [],
                            "testDependencies": []
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "titan-gradle-plugin",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "titan-gradle-plugin",
                            "link": "http://10.73.71.154:7990/scm/titan/titan-gradle-plugin.git",
                            "product": "Titan",
                            "warnings": [],
                            "dependencies": [],
                            "children": [],
                            "testDependencies": [
                                {
                                    "name": "junit",
                                    "group": "junit",
                                    "version": "4.11",
                                    "transientDependency": false
                                },
                                {
                                    "name": "hamcrest-core",
                                    "group": "org.hamcrest",
                                    "version": "1.3",
                                    "transientDependency": false
                                }
                            ]
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "gather-pcf",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 00:09:50 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "gather-pcf",
                            "link": "http://10.73.71.154:7990/scm/sd/gather-pcf.git",
                            "product": "Stains the Dog",
                            "warnings": [
                                "Root project name set differs from stash name",
                                "Detected conflicting versions for spring-beans. Using latest version 3.2.2.RELEASE instead of old version 3.1.2.RELEASE",
                                "Detected conflicting versions for spring-core. Using latest version 3.2.2.RELEASE instead of old version 3.1.2.RELEASE",
                                "Detected conflicting versions for spring-context. Using latest version 3.2.2.RELEASE instead of old version 3.1.2.RELEASE",
                                "Detected conflicting versions for spring-webmvc. Using latest version 3.2.2.RELEASE instead of old version 3.1.2.RELEASE",
                                "Detected conflicting versions for spring-aop. Using latest version 3.2.2.RELEASE instead of old version 3.0.7.RELEASE",
                                "Detected conflicting versions for spring-core. Using latest version 3.2.2.RELEASE instead of old version 3.0.7.RELEASE",
                                "Detected conflicting versions for spring-context. Using latest version 3.2.2.RELEASE instead of old version 3.0.7.RELEASE",
                                "Detected conflicting versions for spring-beans. Using latest version 3.2.2.RELEASE instead of old version 3.0.7.RELEASE",
                                "Detected conflicting versions for spring-expression. Using latest version 3.2.2.RELEASE instead of old version 3.0.7.RELEASE",
                                "Detected conflicting versions for spring-web. Using latest version 3.2.2.RELEASE instead of old version 3.0.7.RELEASE",
                                "Detected conflicting versions for commons-codec. Using latest version 1.6 instead of old version 1.3"
                            ],
                            "dependencies": [
                                {
                                    "name": "elasticsearch",
                                    "group": "org.elasticsearch",
                                    "version": "1.4.0",
                                    "transientDependency": false
                                },
                                {
                                    "name": "lucene-core",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-analyzers-common",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-queries",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-memory",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-highlighter",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-queryparser",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-sandbox",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-suggest",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-misc",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-join",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-grouping",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-spatial",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spatial4j",
                                    "group": "com.spatial4j",
                                    "version": "0.4.1",
                                    "transientDependency": true
                                },
                                {
                                    "name": "antlr-runtime",
                                    "group": "org.antlr",
                                    "version": "3.5",
                                    "transientDependency": true
                                },
                                {
                                    "name": "asm",
                                    "group": "org.ow2.asm",
                                    "version": "4.1",
                                    "transientDependency": true
                                },
                                {
                                    "name": "asm-commons",
                                    "group": "org.ow2.asm",
                                    "version": "4.1",
                                    "transientDependency": true
                                },
                                {
                                    "name": "cloudfoundry-client-lib",
                                    "group": "org.cloudfoundry",
                                    "version": "1.0.2",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-webmvc",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-beans",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-core",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "commons-logging",
                                    "group": "commons-logging",
                                    "version": "1.1.1",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-context",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-aop",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "aopalliance",
                                    "group": "aopalliance",
                                    "version": "1.0",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-expression",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-web",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-security-oauth2",
                                    "group": "org.springframework.security.oauth",
                                    "version": "1.0.0.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-security-core",
                                    "group": "org.springframework.security",
                                    "version": "3.1.3.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-security-config",
                                    "group": "org.springframework.security",
                                    "version": "3.1.3.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-security-web",
                                    "group": "org.springframework.security",
                                    "version": "3.1.3.RELEASE",
                                    "transientDependency": false
                                },
                                {
                                    "name": "commons-codec",
                                    "group": "commons-codec",
                                    "version": "1.6",
                                    "transientDependency": false
                                },
                                {
                                    "name": "jackson-mapper-asl",
                                    "group": "org.codehaus.jackson",
                                    "version": "1.9.2",
                                    "transientDependency": false
                                },
                                {
                                    "name": "jackson-core-asl",
                                    "group": "org.codehaus.jackson",
                                    "version": "1.9.2",
                                    "transientDependency": false
                                },
                                {
                                    "name": "httpclient",
                                    "group": "org.apache.httpcomponents",
                                    "version": "4.2.5",
                                    "transientDependency": false
                                },
                                {
                                    "name": "httpcore",
                                    "group": "org.apache.httpcomponents",
                                    "version": "4.2.4",
                                    "transientDependency": false
                                },
                                {
                                    "name": "commons-io",
                                    "group": "commons-io",
                                    "version": "2.1",
                                    "transientDependency": false
                                },
                                {
                                    "name": "yamlbeans",
                                    "group": "com.esotericsoftware.yamlbeans",
                                    "version": "1.06",
                                    "transientDependency": false
                                }
                            ],
                            "children": [
                                {
                                    "name": "elasticsearch",
                                    "group": "org.elasticsearch",
                                    "version": "1.4.0",
                                    "transientDependency": false,
                                    "children": [
                                        {
                                            "name": "lucene-core",
                                            "group": "org.apache.lucene",
                                            "version": "4.10.2",
                                            "transientDependency": false,
                                            "children": []
                                        },
                                        {
                                            "name": "lucene-analyzers-common",
                                            "group": "org.apache.lucene",
                                            "version": "4.10.2",
                                            "transientDependency": false,
                                            "children": [
                                                {
                                                    "name": "lucene-core",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "name": "lucene-queries",
                                            "group": "org.apache.lucene",
                                            "version": "4.10.2",
                                            "transientDependency": false,
                                            "children": [
                                                {
                                                    "name": "lucene-core",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "name": "lucene-memory",
                                            "group": "org.apache.lucene",
                                            "version": "4.10.2",
                                            "transientDependency": false,
                                            "children": [
                                                {
                                                    "name": "lucene-core",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "name": "lucene-highlighter",
                                            "group": "org.apache.lucene",
                                            "version": "4.10.2",
                                            "transientDependency": false,
                                            "children": [
                                                {
                                                    "name": "lucene-core",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "lucene-memory",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "lucene-queries",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "name": "lucene-queryparser",
                                            "group": "org.apache.lucene",
                                            "version": "4.10.2",
                                            "transientDependency": false,
                                            "children": [
                                                {
                                                    "name": "lucene-core",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "lucene-queries",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "lucene-sandbox",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": [
                                                        {
                                                            "name": "lucene-core",
                                                            "group": "org.apache.lucene",
                                                            "version": "4.10.2",
                                                            "transientDependency": false,
                                                            "children": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "lucene-analyzers-common",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "lucene-core",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "lucene-misc",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": [
                                                        {
                                                            "name": "lucene-core",
                                                            "group": "org.apache.lucene",
                                                            "version": "4.10.2",
                                                            "transientDependency": false,
                                                            "children": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "lucene-queries",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "name": "lucene-misc",
                                            "group": "org.apache.lucene",
                                            "version": "4.10.2",
                                            "transientDependency": false,
                                            "children": []
                                        },
                                        {
                                            "name": "lucene-join",
                                            "group": "org.apache.lucene",
                                            "version": "4.10.2",
                                            "transientDependency": false,
                                            "children": [
                                                {
                                                    "name": "lucene-core",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "lucene-grouping",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": [
                                                        {
                                                            "name": "lucene-core",
                                                            "group": "org.apache.lucene",
                                                            "version": "4.10.2",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "lucene-queries",
                                                            "group": "org.apache.lucene",
                                                            "version": "4.10.2",
                                                            "transientDependency": false,
                                                            "children": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "lucene-core",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "lucene-queries",
                                                    "group": "org.apache.lucene",
                                                    "version": "4.10.2",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "spatial4j",
                                                    "group": "com.spatial4j",
                                                    "version": "0.4.1",
                                                    "transientDependency": false,
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "name": "antlr-runtime",
                                            "group": "org.antlr",
                                            "version": "3.5",
                                            "transientDependency": false,
                                            "children": []
                                        },
                                        {
                                            "name": "asm",
                                            "group": "org.ow2.asm",
                                            "version": "4.1",
                                            "transientDependency": false,
                                            "children": []
                                        },
                                        {
                                            "name": "asm-commons",
                                            "group": "org.ow2.asm",
                                            "version": "4.1",
                                            "transientDependency": false,
                                            "children": []
                                        }
                                    ]
                                },
                                {
                                    "name": "cloudfoundry-client-lib",
                                    "group": "org.cloudfoundry",
                                    "version": "1.0.2",
                                    "transientDependency": false,
                                    "children": [
                                        {
                                            "name": "spring-webmvc",
                                            "group": "org.springframework",
                                            "version": "3.2.2.RELEASE",
                                            "transientDependency": false,
                                            "children": [
                                                {
                                                    "name": "spring-beans",
                                                    "group": "org.springframework",
                                                    "version": "3.2.2.RELEASE",
                                                    "transientDependency": false,
                                                    "children": [
                                                        {
                                                            "name": "spring-core",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": [
                                                                {
                                                                    "name": "commons-logging",
                                                                    "group": "commons-logging",
                                                                    "version": "1.1.1",
                                                                    "transientDependency": false,
                                                                    "children": []
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "name": "spring-aop",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": [
                                                                {
                                                                    "name": "aopalliance",
                                                                    "group": "aopalliance",
                                                                    "version": "1.0",
                                                                    "transientDependency": false,
                                                                    "children": []
                                                                },
                                                                {
                                                                    "name": "spring-beans",
                                                                    "group": "org.springframework",
                                                                    "version": "3.2.2.RELEASE",
                                                                    "transientDependency": false,
                                                                    "children": []
                                                                },
                                                                {
                                                                    "name": "spring-core",
                                                                    "group": "org.springframework",
                                                                    "version": "3.2.2.RELEASE",
                                                                    "transientDependency": false,
                                                                    "children": []
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "name": "spring-beans",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-core",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-expression",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": [
                                                                {
                                                                    "name": "spring-core",
                                                                    "group": "org.springframework",
                                                                    "version": "3.2.2.RELEASE",
                                                                    "transientDependency": false,
                                                                    "children": []
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "name": "aopalliance",
                                                            "group": "aopalliance",
                                                            "version": "1.0",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-aop",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-beans",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-context",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-core",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "spring-beans",
                                                    "group": "org.springframework",
                                                    "version": "3.2.2.RELEASE",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "spring-core",
                                                    "group": "org.springframework",
                                                    "version": "3.2.2.RELEASE",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "spring-context",
                                                    "group": "org.springframework",
                                                    "version": "3.2.2.RELEASE",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "spring-webmvc",
                                                    "group": "org.springframework",
                                                    "version": "3.2.2.RELEASE",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "spring-security-core",
                                                    "group": "org.springframework.security",
                                                    "version": "3.1.3.RELEASE",
                                                    "transientDependency": false,
                                                    "children": [
                                                        {
                                                            "name": "spring-aop",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-core",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "aopalliance",
                                                            "group": "aopalliance",
                                                            "version": "1.0",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-context",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-beans",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-expression",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "spring-security-config",
                                                    "group": "org.springframework.security",
                                                    "version": "3.1.3.RELEASE",
                                                    "transientDependency": false,
                                                    "children": [
                                                        {
                                                            "name": "spring-core",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-aop",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-security-core",
                                                            "group": "org.springframework.security",
                                                            "version": "3.1.3.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "aopalliance",
                                                            "group": "aopalliance",
                                                            "version": "1.0",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-context",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-beans",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "spring-security-web",
                                                    "group": "org.springframework.security",
                                                    "version": "3.1.3.RELEASE",
                                                    "transientDependency": false,
                                                    "children": [
                                                        {
                                                            "name": "spring-aop",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-security-core",
                                                            "group": "org.springframework.security",
                                                            "version": "3.1.3.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-web",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "aopalliance",
                                                            "group": "aopalliance",
                                                            "version": "1.0",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-context",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-core",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-beans",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        },
                                                        {
                                                            "name": "spring-expression",
                                                            "group": "org.springframework",
                                                            "version": "3.2.2.RELEASE",
                                                            "transientDependency": false,
                                                            "children": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "commons-codec",
                                                    "group": "commons-codec",
                                                    "version": "1.6",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "jackson-mapper-asl",
                                                    "group": "org.codehaus.jackson",
                                                    "version": "1.9.2",
                                                    "transientDependency": false,
                                                    "children": [
                                                        {
                                                            "name": "jackson-core-asl",
                                                            "group": "org.codehaus.jackson",
                                                            "version": "1.9.2",
                                                            "transientDependency": false,
                                                            "children": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "name": "httpcore",
                                                    "group": "org.apache.httpcomponents",
                                                    "version": "4.2.4",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "commons-logging",
                                                    "group": "commons-logging",
                                                    "version": "1.1.1",
                                                    "transientDependency": false,
                                                    "children": []
                                                },
                                                {
                                                    "name": "commons-codec",
                                                    "group": "commons-codec",
                                                    "version": "1.6",
                                                    "transientDependency": false,
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "name": "commons-io",
                                            "group": "commons-io",
                                            "version": "2.1",
                                            "transientDependency": false,
                                            "children": []
                                        },
                                        {
                                            "name": "yamlbeans",
                                            "group": "com.esotericsoftware.yamlbeans",
                                            "version": "1.06",
                                            "transientDependency": false,
                                            "children": []
                                        }
                                    ]
                                }
                            ],
                            "testDependencies": [
                                {
                                    "name": "elasticsearch",
                                    "group": "org.elasticsearch",
                                    "version": "1.4.0",
                                    "transientDependency": false
                                },
                                {
                                    "name": "lucene-core",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-analyzers-common",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-queries",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-memory",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-highlighter",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-queryparser",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-sandbox",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-suggest",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-misc",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-join",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-grouping",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "lucene-spatial",
                                    "group": "org.apache.lucene",
                                    "version": "4.10.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spatial4j",
                                    "group": "com.spatial4j",
                                    "version": "0.4.1",
                                    "transientDependency": true
                                },
                                {
                                    "name": "antlr-runtime",
                                    "group": "org.antlr",
                                    "version": "3.5",
                                    "transientDependency": true
                                },
                                {
                                    "name": "asm",
                                    "group": "org.ow2.asm",
                                    "version": "4.1",
                                    "transientDependency": true
                                },
                                {
                                    "name": "asm-commons",
                                    "group": "org.ow2.asm",
                                    "version": "4.1",
                                    "transientDependency": true
                                },
                                {
                                    "name": "cloudfoundry-client-lib",
                                    "group": "org.cloudfoundry",
                                    "version": "1.0.2",
                                    "transientDependency": false
                                },
                                {
                                    "name": "spring-webmvc",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-beans",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-core",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "commons-logging",
                                    "group": "commons-logging",
                                    "version": "1.1.1",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-context",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-aop",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "aopalliance",
                                    "group": "aopalliance",
                                    "version": "1.0",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-expression",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-web",
                                    "group": "org.springframework",
                                    "version": "3.2.2.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-security-oauth2",
                                    "group": "org.springframework.security.oauth",
                                    "version": "1.0.0.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-security-core",
                                    "group": "org.springframework.security",
                                    "version": "3.1.3.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-security-config",
                                    "group": "org.springframework.security",
                                    "version": "3.1.3.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "spring-security-web",
                                    "group": "org.springframework.security",
                                    "version": "3.1.3.RELEASE",
                                    "transientDependency": true
                                },
                                {
                                    "name": "commons-codec",
                                    "group": "commons-codec",
                                    "version": "1.6",
                                    "transientDependency": true
                                },
                                {
                                    "name": "jackson-mapper-asl",
                                    "group": "org.codehaus.jackson",
                                    "version": "1.9.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "jackson-core-asl",
                                    "group": "org.codehaus.jackson",
                                    "version": "1.9.2",
                                    "transientDependency": true
                                },
                                {
                                    "name": "httpclient",
                                    "group": "org.apache.httpcomponents",
                                    "version": "4.2.5",
                                    "transientDependency": true
                                },
                                {
                                    "name": "httpcore",
                                    "group": "org.apache.httpcomponents",
                                    "version": "4.2.4",
                                    "transientDependency": true
                                },
                                {
                                    "name": "commons-io",
                                    "group": "commons-io",
                                    "version": "2.1",
                                    "transientDependency": true
                                },
                                {
                                    "name": "yamlbeans",
                                    "group": "com.esotericsoftware.yamlbeans",
                                    "version": "1.06",
                                    "transientDependency": true
                                },
                                {
                                    "name": "junit",
                                    "group": "junit",
                                    "version": "4.11",
                                    "transientDependency": false
                                },
                                {
                                    "name": "hamcrest-core",
                                    "group": "org.hamcrest",
                                    "version": "1.3",
                                    "transientDependency": false
                                }
                            ]
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "webui-icons",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 00:09:51 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "webui-icons",
                            "link": "http://10.73.71.154:7990/scm/ui/webui-icons.git",
                            "product": "Web UI Framework",
                            "warnings": [],
                            "dependencies": [],
                            "children": [],
                            "testDependencies": []
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "croneight",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "croneight",
                            "link": "http://10.73.71.154:7990/scm/cron/croneight.git",
                            "product": "Cronus",
                            "warnings": [],
                            "dependencies": [],
                            "children": [],
                            "testDependencies": []
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "cronus-analysis-configuration",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "cronus-analysis-configuration",
                            "link": "http://10.73.71.154:7990/scm/cron/cronus-analysis-configuration.git",
                            "product": "Cronus",
                            "warnings": ["Root project name set differs from stash name"],
                            "dependencies": [],
                            "children": [],
                            "testDependencies": []
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "cronus-index",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "cronus-index",
                            "link": "http://10.73.71.154:7990/scm/cron/cronus-index.git",
                            "product": "Cronus",
                            "warnings": ["Root project name set differs from stash name"],
                            "dependencies": [],
                            "children": [],
                            "testDependencies": []
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "emc-intelligentinsight",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "emc-intelligentinsight",
                            "link": "http://10.73.71.154:7990/scm/cron/emc-intelligentinsight.git",
                            "product": "Cronus",
                            "warnings": [],
                            "dependencies": [],
                            "children": [],
                            "testDependencies": []
                        }
                    }
                },
                {
                    "_index": "stains",
                    "_type": "devProject",
                    "_id": "basic-vplex-sizer-app-ng-api",
                    "_score": 1.0,
                    "_source": {
                        "user": "dillos",
                        "date": "29 Nov 2014 10:10:12 GMT",
                        "source": "Stash",
                        "message": {
                            "name": "basic-vplex-sizer-app-ng-api",
                            "link": "http://10.73.71.154:7990/scm/siz/basic-vplex-sizer-app-ng-api.git",
                            "product": "Sizing",
                            "warnings": [],
                            "dependencies": [],
                            "children": [],
                            "testDependencies": []
                        }
                    }
                }
            ]
        }
    }
};