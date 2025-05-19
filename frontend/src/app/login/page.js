// frontend/src/app/login/page.js
import AuthForm from '../../components/AuthForm';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <AuthForm isRegister={false} />
    </div>
  );
}