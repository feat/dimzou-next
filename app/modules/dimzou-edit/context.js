import { createContext } from 'react';

export const AppContext = createContext({}); // 路由

export const BundleContext = createContext();
export const NodeContext = createContext();
export const WorkspaceContext = createContext();
export const UserCapabilitiesContext = createContext();
export const OwnerContext = createContext();
export const WorkshopContext = createContext(); // 用户文章列表上下文

export const PublicationBundleContext = createContext();
export const PublicationContext = createContext();
export const ScrollContext = createContext({});
