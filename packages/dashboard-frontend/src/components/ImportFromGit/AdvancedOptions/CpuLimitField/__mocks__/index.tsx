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

import { Props } from '@/components/ImportFromGit/AdvancedOptions/CpuLimitField';

export class CpuLimitField extends React.PureComponent<Props> {
  public render() {
    const { cpuLimit, onChange } = this.props;

    return (
      <div data-testid="cpu-limit-component">
        <div>Cpu Limit</div>
        <div data-testid="cpu-limit">{cpuLimit.toString()}</div>
        <button onClick={() => onChange(1)}>Cpu Limit Change</button>
      </div>
    );
  }
}
