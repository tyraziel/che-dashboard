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

import { Props } from '@/components/EditorSelector/Definition/DefinitionField';

export class EditorDefinitionField extends React.PureComponent<Props> {
  public render() {
    const { onChange } = this.props;

    return (
      <div data-testid="editor-definition-field">
        <button onClick={() => onChange('some/editor/id')}>Editor Definition Change</button>
        Editor Definition Field
      </div>
    );
  }
}
