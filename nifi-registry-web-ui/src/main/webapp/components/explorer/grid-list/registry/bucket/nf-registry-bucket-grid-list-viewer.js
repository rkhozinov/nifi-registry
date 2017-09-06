/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ngCore = require('@angular/core');
var NfRegistryService = require('nifi-registry/services/nf-registry.service.js');
var ngRouter = require('@angular/router');

/**
 * NfRegistryBucketGridListViewer constructor.
 *
 * @param nfRegistryService     The nf-registry.service module.
 * @param ActivatedRoute        The angular activated route module.
 * @constructor
 */
function NfRegistryBucketGridListViewer(nfRegistryService, ActivatedRoute) {
    this.route = ActivatedRoute;
    this.nfRegistryService = nfRegistryService;
};

NfRegistryBucketGridListViewer.prototype = {
    constructor: NfRegistryBucketGridListViewer,

    /**
     * Initialize the component.
     */
    ngOnInit: function () {
        var self = this;
        this.route.params
            .switchMap(function (params) {
                return self.nfRegistryService.getBuckets(self.nfRegistryService.registry.id, params['bucketId']);
            })
            .subscribe(function (buckets) {
                self.nfRegistryService.bucket = buckets[0];
                self.nfRegistryService.getDroplets(self.nfRegistryService.registry.id, self.nfRegistryService.bucket.id).then(function (droplets) {
                    self.nfRegistryService.droplets = self.nfRegistryService.filteredDroplets = droplets;
                    self.nfRegistryService.filterDroplets();
                });
            });
    },

    /**
     * Destroy the component.
     */
    ngOnDestroy: function () {
        var self = this;
        this.nfRegistryService.bucket = {};
        this.nfRegistryService.getDroplets(this.nfRegistryService.registry.id).then(
            function (droplets) {
                self.nfRegistryService.droplets = self.nfRegistryService.filteredDroplets = droplets;
                self.nfRegistryService.filterDroplets();
            });
    }
};

NfRegistryBucketGridListViewer.annotations = [
    new ngCore.Component({
        template: require('./nf-registry-bucket-grid-list-viewer.html!text')
    })
];

NfRegistryBucketGridListViewer.parameters = [NfRegistryService, ngRouter.ActivatedRoute];

module.exports = NfRegistryBucketGridListViewer;