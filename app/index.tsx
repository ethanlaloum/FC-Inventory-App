import { Redirect } from 'expo-router';
import { useUser } from './UserContext';

export default function Index() {
  const { token } = useUser();

  if (token) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
}
