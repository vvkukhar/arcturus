import { redirect } from 'next/navigation';

export default function StoreRedirect() {
  redirect('/store/catalog');
}