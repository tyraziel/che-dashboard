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

import { Props } from '@/pages/GetStarted/SamplesList';

export default class SamplesList extends React.PureComponent<Props> {
  render() {
    const { editorDefinition, editorImage } = this.props;
    return (
      <div data-testid="samples-list">
        <div data-testid="editor-definition">{editorDefinition ? editorDefinition : ''}</div>
        <div data-testid="editor-image">{editorImage ? editorImage : ''}</div>
        Samples List
      </div>
    );
  }
}
