import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { userService } from "@/services/api/user";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";


// Define the schema for the form using Zod
const formSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
}).refine(
  (values) => {
    return values.password === values.confirmPassword;
  },
  {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  }
) ;

const ResetPassword = () => {
  const token  = useParams();
  // Define your form with React Hook Form and Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleResetPassword = async (data:any ,token:any) => {
    try
    {
     // console.log("Data:",data,token);
      setLoading(true);
      setError(null);
       const response = await userService.resetPassword(data,token);
      console.log("Reset Password:", response);
      toast({
        title: response.data.message || "Password Reset Successfully",
      })
      navigate("/login");
    }catch(err:AxiosError | any){
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid password. Please try again.");
      }
    }finally{
      setLoading(false);
    }
  }

  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission, typically by sending a reset password request to the server
   
     handleResetPassword(values,token);
  }

  return (
    <Form {...form}>
      <h6>EvitalRx</h6>
      <h1 className="text-2xl font-bold">Reset Your Password</h1>
      <h5 className="text-sm">
        Enter your new password below. Already have an account? <Link to={'/login'} className="text-blue-500 underline">Login here.</Link>
      </h5>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
     {error && <p className="error">{error}</p>}
        <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPassword;
