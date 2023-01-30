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

import { createSelector } from 'reselect';
import { AppState } from '..';

const selectState = (state: AppState) => state.factoryResolver;

export const selectFactoryResolver = createSelector(selectState, state => state.resolver);

export const selectFactoryResolverConverted = createSelector(selectState, state => state.converted);

export const selectFactoryResolverError = createSelector(selectState, state => state.error);
