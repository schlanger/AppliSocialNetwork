import { Link, Href } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { ComponentProps } from 'react';
import { Platform } from 'react-native';

// Correction du type en utilisant 'Href<string | object>'
type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href<string | object> };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href} // Utilise le type Href ici
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
          await openBrowserAsync(href as string); // Convertir l'href en chaîne pour l'ouverture dans un navigateur
        }
      }}
    />
  );
}
