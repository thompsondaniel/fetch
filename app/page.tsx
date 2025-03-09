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
    <div className="page">
      <Card className="card-sm animate__animated animate__fadeInUp">
        <CardHeader className="card-header">
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
