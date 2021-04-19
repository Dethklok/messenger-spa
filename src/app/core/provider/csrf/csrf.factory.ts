import { CsrfProvider } from '@core/provider/csrf/csrf.provider';

export function csrfProviderFactory(provider: CsrfProvider): () => Promise<boolean> {
  return () => provider.initialize();
}
