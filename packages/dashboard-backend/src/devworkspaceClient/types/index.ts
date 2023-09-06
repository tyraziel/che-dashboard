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

import {
  V1alpha2DevWorkspace,
  V1alpha2DevWorkspaceTemplate,
  V221DevfileComponents,
} from '@devfile/api';
import { api } from '@eclipse-che/common';
import * as k8s from '@kubernetes/client-node';
import { MessageListener } from '../../services/types/Observer';
import { IncomingHttpHeaders } from 'http';

/**
 * Holds the methods for working with dockerconfig for devworkspace
 * which is stored in Kubernetes Secret and is annotated in DevWorkspace operator specific way.
 */
export interface IDockerConfigApi {
  /**
   * Get DockerConfig in the specified namespace
   */
  read(namespace: string): Promise<api.IDockerConfig>;

  /**
   * Replace DockerConfig in the specified namespace
   */
  update(namespace: string, dockerCfg: api.IDockerConfig): Promise<api.IDockerConfig>;
}

export interface IDevWorkspaceApi extends IWatcherService<api.webSocket.SubscribeParams> {
  /**
   * Get the DevWorkspace with given namespace in the specified namespace
   */
  getByName(namespace: string, name: string): Promise<V1alpha2DevWorkspace>;

  /**
   * Get list of DevWorkspaces in the given namespace
   */
  listInNamespace(namespace: string): Promise<api.IDevWorkspaceList>;

  /**
   * Create a DevWorkspace based on the specified configuration.
   */
  create(
    devWorkspace: V1alpha2DevWorkspace,
    namespace: string,
  ): Promise<{ devWorkspace: V1alpha2DevWorkspace; headers: Partial<IncomingHttpHeaders> }>;

  /**
   * Delete the DevWorkspace with given name in the specified namespace
   */
  delete(namespace: string, name: string): Promise<void>;

  /**
   * Patches the DevWorkspace with given name in the specified namespace
   */
  patch(
    namespace: string,
    name: string,
    patches: api.IPatch[],
  ): Promise<{ devWorkspace: V1alpha2DevWorkspace; headers: Partial<IncomingHttpHeaders> }>;
}

export interface IEventApi extends IWatcherService<api.webSocket.SubscribeParams> {
  /**
   * Get list of Events in the given namespace
   */
  listInNamespace(namespace: string): Promise<api.IEventList>;
}

export interface IPodApi extends IWatcherService<api.webSocket.SubscribeParams> {
  /**
   * Get list of Pods in the given namespace
   */
  listInNamespace(namespace: string): Promise<api.IPodList>;
}

export type ILogsApi = IWatcherService<api.webSocket.SubscribeLogsParams>;

export interface IDevWorkspaceTemplateApi {
  listInNamespace(namespace: string): Promise<V1alpha2DevWorkspaceTemplate[]>;
  getByName(namespace: string, name: string): Promise<V1alpha2DevWorkspaceTemplate>;
  patch(
    namespace: string,
    name: string,
    patches: api.IPatch[],
  ): Promise<V1alpha2DevWorkspaceTemplate>;
  delete(namespace: string, name: string): Promise<void>;
  create(template: V1alpha2DevWorkspaceTemplate): Promise<V1alpha2DevWorkspaceTemplate>;
}

export type CustomResourceDefinitionList = k8s.V1CustomResourceDefinitionList & {
  items?: CustomResourceDefinition[];
};

export type CustomResourceDefinition = k8s.V1CustomResourceDefinition & {
  spec: {
    devEnvironments?: CustomResourceDefinitionSpecDevEnvironments;
    components?: CustomResourceDefinitionSpecComponents;
  };
  status: {
    devfileRegistryURL: string;
    pluginRegistryURL: string;
  };
};

export type CustomResourceDefinitionSpecDevEnvironments = {
  containerBuildConfiguration?: {
    openShiftSecurityContextConstraint?: string;
  };
  defaultComponents?: V221DevfileComponents[];
  defaultEditor?: string;
  defaultPlugins?: api.IWorkspacesDefaultPlugins[];
  disableContainerBuildCapabilities?: boolean;
  secondsOfInactivityBeforeIdling?: number;
  secondsOfRunBeforeIdling?: number;
  startTimeoutSeconds?: number;
  storage?: {
    pvcStrategy?: string;
  };
  maxNumberOfRunningWorkspacesPerUser: number;
  maxNumberOfWorkspacesPerUser: number;
};

export type CustomResourceDefinitionSpecComponents = {
  dashboard?: {
    branding?: {
      logo?: {
        base64data: string;
        mediatype: string;
      };
    };
    headerMessage?: {
      show?: boolean;
      text?: string;
    };
  };
  devWorkspace?: {
    runningLimit?: number;
  };
  pluginRegistry?: {
    openVSXURL?: string;
  };
  devfileRegistry: {
    disableInternalRegistry?: boolean;
    externalDevfileRegistries?: api.IExternalDevfileRegistry[];
  };
};

export interface IServerConfigApi {
  /**
   * Returns custom resource
   */
  fetchCheCustomResource(): Promise<CustomResourceDefinition>;
  /**
   * Returns the container build capabilities and configuration.
   */
  getContainerBuild(
    cheCustomResource: CustomResourceDefinition,
  ): Pick<
    CustomResourceDefinitionSpecDevEnvironments,
    'containerBuildConfiguration' | 'disableContainerBuildCapabilities'
  >;
  /**
   * Returns default plugins
   */
  getDefaultPlugins(cheCustomResource: CustomResourceDefinition): api.IWorkspacesDefaultPlugins[];
  /**
   * Returns the default devfile registry URL.
   */
  getDefaultDevfileRegistryUrl(cheCustomResource: CustomResourceDefinition): string;
  /**
   * Returns the plugin registry URL.
   */
  getDefaultPluginRegistryUrl(cheCustomResource: CustomResourceDefinition): string;
  /**
   * Returns the default editor to workspace create with. It could be a plugin ID or a URI.
   */
  getDefaultEditor(cheCustomResource: CustomResourceDefinition): string | undefined;
  /**
   * Returns the default components applied to DevWorkspaces.
   * These default components are meant to be used when a Devfile does not contain any components.
   */
  getDefaultComponents(cheCustomResource: CustomResourceDefinition): V221DevfileComponents[];
  /**
   * Returns the openVSX URL.
   */
  getOpenVSXURL(cheCustomResource: CustomResourceDefinition): string;
  /**
   * Returns the internal registry disable status.
   */
  getInternalRegistryDisableStatus(cheCustomResource: CustomResourceDefinition): boolean;
  /**
   * Returns the external devfile registries.
   */
  getExternalDevfileRegistries(
    cheCustomResource: CustomResourceDefinition,
  ): api.IExternalDevfileRegistry[];
  /**
   * Returns the PVC strategy if it is defined.
   */
  getPvcStrategy(cheCustomResource: CustomResourceDefinition): string | undefined;
  /**
   * Returns a maintenance warning.
   */
  getDashboardWarning(cheCustomResource: CustomResourceDefinition): string | undefined;

  /**
   * Returns limit of running workspaces per user.
   */
  getRunningWorkspacesLimit(cheCustomResource: CustomResourceDefinition): number;

  /**
   * Returns the total number of workspaces, both stopped and running, that a user can keep.
   */
  getAllWorkspacesLimit(cheCustomResource: CustomResourceDefinition): number;

  /**
   * Returns the workspace inactivity timeout
   */
  getWorkspaceInactivityTimeout(cheCustomResource: CustomResourceDefinition): number;

  /**
   * Returns the workspace run timeout
   */
  getWorkspaceRunTimeout(cheCustomResource: CustomResourceDefinition): number;

  /**
   * Returns the workspace start timeout
   */
  getWorkspaceStartTimeout(cheCustomResource: CustomResourceDefinition): number;

  /**
   * Returns the dashboard branding logo
   */
  getDashboardLogo(
    cheCustomResource: CustomResourceDefinition,
  ): { base64data: string; mediatype: string } | undefined;
}

export interface IKubeConfigApi {
  /**
   * Inject the kubeconfig into all containers with the given devworkspaceId in a namespace.
   */
  injectKubeConfig(namespace: string, devworkspaceId: string): Promise<void>;
}

export interface IPodmanApi {
  /**
   * Executes the 'podman login' command to the OpenShift internal registry.
   */
  podmanLogin(namespace: string, devworkspaceId: string): Promise<void>;
}

export interface IUserProfileApi {
  /**
   * Returns user profile object that contains username and email.
   */
  getUserProfile(namespace: string): Promise<api.IUserProfile | undefined>;
}

export interface IPersonalAccessTokenApi {
  /**
   * Reads all the PAT secrets from the specified namespace.
   */
  listInNamespace(namespace: string): Promise<Array<api.PersonalAccessToken>>;

  /**
   * Creates a PAT secret.
   */
  create(
    namespace: string,
    personalAccessToken: api.PersonalAccessToken,
  ): Promise<api.PersonalAccessToken>;

  /**
   * "Updates" an existing PAT secret.
   */
  replace(
    namespace: string,
    personalAccessToken: api.PersonalAccessToken,
  ): Promise<api.PersonalAccessToken>;

  /**
   * Deletes a PAT secret.
   */
  delete(namespace: string, name: string): Promise<void>;
}

export interface IDevWorkspaceClient {
  devWorkspaceTemplateApi: IDevWorkspaceTemplateApi;
  devworkspaceApi: IDevWorkspaceApi;
  dockerConfigApi: IDockerConfigApi;
  eventApi: IEventApi;
  kubeConfigApi: IKubeConfigApi;
  logsApi: ILogsApi;
  personalAccessTokenApi: IPersonalAccessTokenApi;
  podApi: IPodApi;
  serverConfigApi: IServerConfigApi;
  userProfileApi: IUserProfileApi;
}

export interface IWatcherService<T = Record<string, unknown>> {
  /**
   * Listen to objects changes in the given namespace
   * @param listener callback will be invoked when change happens
   * @param params optional parameters, e.g. `resourceVersion` to start watching from a specific version
   */
  watchInNamespace(listener: MessageListener, params: T): Promise<void>;

  /**
   * Stop watching objects changes in the given namespace
   */
  stopWatching(): void;
}

export interface IGettingStartedSampleApi {
  /**
   * Reads all the Getting Started Samples ConfigMaps.
   */
  list(): Promise<Array<api.IGettingStartedSample>>;
}
