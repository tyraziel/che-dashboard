/*
 * Copyright (c) 2018-2024 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import React from 'react';

import { Props } from '@/pages/WorkspaceDetails/OverviewTab/StorageType';

export default class StorageTypeFormGroup extends React.PureComponent<Props> {
  render() {
    if (this.props.parentStorageType) {
      return (
        <div>
          Mock Storage Type Form
          <button disabled={true} onClick={() => this.props.onSave('per-workspace')}>
            Change storage type
          </button>
          <span>StorageType: {this.props.storageType}</span>
        </div>
      );
    } else {
      return (
        <div>
          Mock Storage Type Form
          <button onClick={() => this.props.onSave('per-workspace')}>Change storage type</button>
          <span>StorageType: {this.props.storageType}</span>
        </div>
      );
    }
  }
}
