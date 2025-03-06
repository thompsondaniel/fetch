import { LoginForm } from "@/components/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="login-page">
      <Card className="login-card">
        <CardHeader className="login-card-header">
          <CardTitle>Welcome to Fetch</CardTitle>
          <CardDescription>Please sign in below.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
