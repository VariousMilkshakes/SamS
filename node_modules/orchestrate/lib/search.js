// Copyright 2013 Bowery Software, LLC
/**
 * @fileoverview Search builder.
 */


// Module Dependencies.
var assert = require('assert')
var Builder = require('./builder')
var BucketBuilder = require('./bucket_builder');

/**
 * @constructor
 */
function SearchBuilder () {}


require('util').inherits(SearchBuilder, Builder)


/**
 * Set collection.
 * @param {string} collection
 * @return {SearchBuilder}
 */
SearchBuilder.prototype.collection = function (collection) {
  assert(collection, 'Collection required.')
  this._collection = collection
  return this
}


/**
 * Set limit.
 * @param {number} limit
 * @return {SearchBuilder}
 */
SearchBuilder.prototype.limit = function (limit) {
  assert(limit, 'Limit required.')
  this._limit = limit
  return this
}


/**
 * Set offset.
 * @param {number} offset
 * @return {SearchBuilder}
 */
SearchBuilder.prototype.offset = function (offset) {
  assert.equal(typeof offset, 'number', 'Offset required.')
  this._offset = offset
  return this
}


/**
 * Set sort.
 * @param {string} field
 * @param {string} order
 * @return {SearchBuilder}
 */
SearchBuilder.prototype.sort = function (field, order) {
  assert(field, 'field required')
  assert(order, 'order required')
  var _sort = 'value.' + field + ':' + order
  if (this._sort) this._sort = [this._sort, _sort].join(',')
  else this._sort = _sort
  return this
}


/**
 * Add new aggregate parameter.
 * @param {string} type
 * @param {string} path
 * @param {string} value
 * @return {SearchBuilder}
 */
SearchBuilder.prototype.aggregate = function (type, path, value) {
  assert(type, 'type required');
  assert(path, 'path required');
  var _aggregate = [path, type, value].join(':');
  if (this._aggregate) 
    this._aggregate = [this._aggregate, _aggregate].join(',');
  else
    this._aggregate = _aggregate;
  return this;
}

/**
 * Add new 'stats' aggregate parameter.
 * @param {string} type
 * @param {string} path
 * @param {string} value
 * @return {SearchBuilder}
 */
 SearchBuilder.prototype.stats = function (path) {
  return this.aggregate('stats', path);
 }

 /**
 * Add new 'range' aggregate parameter.
 * @param {string} type
 * @param {string} path
 * @param {string} value
 * @return {SearchBuilder}
 */
 SearchBuilder.prototype.range = function (path, buckets) {
  var _buckets = buckets;
  if (typeof(buckets) === 'function') {
    _buckets = buckets(new BucketBuilder());
    if (_buckets.build) _buckets = _buckets.build(); 
  }

  return this.aggregate('range', path, _buckets);
 }

 /**
 * Add new 'distance' aggregate parameter.
 * @param {string} type
 * @param {string} path
 * @param {string} value
 * @return {SearchBuilder}
 */
SearchBuilder.prototype.distance = function (path, buckets) {
  var _buckets = buckets;
  if (typeof(buckets) === 'function') {
    _buckets = buckets(new BucketBuilder());
    if (_buckets.build) _buckets = _buckets.build(); 
  }

  return this.aggregate('distance', path, _buckets);
 }

 /**
 * Add new 'time_series' aggregate parameter.
 * @param {string} type
 * @param {string} path
 * @param {string} value
 * @return {SearchBuilder}
 */
 SearchBuilder.prototype.time_series = function (path, time) {
  return this.aggregate('time_series', path, time);
 }

/**
 * Set query.
 * @param {string} query
 * @return {SearchBuilder}
 */
SearchBuilder.prototype.query = function (query) {
  assert(query, 'Query required.')
  this._query = query
  return this._execute('get')
}


/**
 * Execute search.
 * @return {Object}
 * @protected
 */
SearchBuilder.prototype._execute = function (method) {
  assert(this._collection && this._query, 'Collection and query required.')
  var pathArgs = [this._collection]
  var url = this.getDelegate() && this.getDelegate().generateApiUrl(pathArgs, {
    query: this._query,
    limit: this._limit,
    offset: this._offset,
    sort: this._sort,
    aggregate: this._aggregate
  })

  return this.getDelegate()['_' + method](url)
}


// Module Exports.
module.exports = SearchBuilder
