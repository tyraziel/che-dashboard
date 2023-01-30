/*
 * Copyright (c) 2018-2023 Red Hat, Inc.
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
import { container } from '../../../../inversify.config';
import BannerAlertWebSocket from '..';
import { DevWorkspaceClient } from '../../../../services/workspace-client/devworkspace/devWorkspaceClient';
import { Provider } from 'react-redux';
import { FakeStoreBuilder } from '../../../../store/__mocks__/storeBuilder';
import { BrandingData } from '../../../../services/bootstrap/branding.constant';
import { render, RenderResult } from '@testing-library/react';

const failingWebSocketName = 'Failing websocket';
const failingMessage = 'WebSocket connections are failing';

class mockDevWorkspaceClient extends DevWorkspaceClient {
  get failingWebSockets() {
    return [failingWebSocketName];
  }
}

const store = new FakeStoreBuilder()
  .withBranding({
    docs: {
      webSocketTroubleshooting: 'http://sample_documentation',
    },
  } as BrandingData)
  .build();

describe('BannerAlertWebSocket component', () => {
  it('should show error message when error found before mounting', () => {
    container.rebind(DevWorkspaceClient).to(mockDevWorkspaceClient).inSingletonScope();
    const component = renderComponent(<BannerAlertWebSocket />);
    container.rebind(DevWorkspaceClient).to(DevWorkspaceClient).inSingletonScope();
    expect(
      component.getAllByText(failingMessage, {
        exact: false,
      }).length,
    ).toEqual(1);
  });

  it('should show error message when error found after mounting', () => {
    const comp = (
      <Provider store={store}>
        <BannerAlertWebSocket />
      </Provider>
    );
    const component = renderComponent(comp);
    expect(
      component.queryAllByText(failingMessage, {
        exact: false,
      }),
    ).toEqual([]);
    container.rebind(DevWorkspaceClient).to(mockDevWorkspaceClient).inSingletonScope();
    component.rerender(comp);
    container.rebind(DevWorkspaceClient).to(DevWorkspaceClient).inSingletonScope();
    expect(
      component.getAllByText(failingMessage, {
        exact: false,
      }).length,
    ).toEqual(1);
  });

  it('should not show error message if none is present', () => {
    const component = renderComponent(<BannerAlertWebSocket />);
    expect(
      component.queryAllByText(failingMessage, {
        exact: false,
      }),
    ).toEqual([]);
  });
});

function renderComponent(component: React.ReactElement): RenderResult {
  return render(<Provider store={store}>{component}</Provider>);
}
