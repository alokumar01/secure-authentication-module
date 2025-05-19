// frontend/src/app/register/page.js
import AuthForm from '../../components/AuthForm';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-600 ">
      <AuthForm isRegister={true} />
    </div>
  );
}