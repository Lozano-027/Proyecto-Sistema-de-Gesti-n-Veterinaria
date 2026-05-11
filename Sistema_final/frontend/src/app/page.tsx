/**
 * Página de inicio (/).
 * Redirige automáticamente al dashboard.
 */
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
