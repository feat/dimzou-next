import { createContext, useEffect, useContext } from 'react';

export const BundleContext = createContext();
export const NodeContext = createContext();
export const WorkspaceContext = createContext();
export const UserCapabilitiesContext = createContext();
export const OwnerContext = createContext();

export const PublicationBundleContext = createContext();
export const PublicationContext = createContext();
export const ScrollContext = createContext({});

export const MeasureContext = createContext();

export const useMeasure = (deps) => {
  const measureContext = useContext(MeasureContext);
  useEffect(() => {
    if (!measureContext) {
      return;
    }
    measureContext.measure();
  }, deps)
}