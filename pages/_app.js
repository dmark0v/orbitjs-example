import React from 'react';
import App from 'next/app';
import { OrbitService } from '../orbit/service.mjs';
import MemorySource from '@orbit/memory';
import { Schema } from "@orbit/data";
import JSONAPISource from "@orbit/jsonapi";
import IndexedDBSource from "@orbit/indexeddb";
import Coordinator from "@orbit/coordinator";
import { RequestStrategy, SyncStrategy } from "@orbit/coordinator";

OrbitService.initialize({
  MemorySource,
  Schema,
  JSONAPISource,
  IndexedDBSource,
  Coordinator,
  RequestStrategy,
  SyncStrategy
});

class MyApp extends App {
    render () {
        const { Component, pageProps } = this.props;

        return (
          <Component {...pageProps} />
        )
    }
}

export default MyApp;
