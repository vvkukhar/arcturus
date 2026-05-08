import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // Просто автоматично перекидаємо юзера з /admin на /admin/dashboard
  redirect('/admin/dashboard');
}