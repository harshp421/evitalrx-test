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
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { userService } from "@/services/api/user";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";

// Define the schema for the form using Zod
const formSchema = z.object({
  email: z
    .string()
    .min(5, { message: "This field has to be filled." })
    .email("This is not a valid email."),
});

const ForgetPassword = () => {
  // Define your form with React Hook Form and Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
   const handleForgetPassword = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.forgetPassword(values
      );
      toast({
        title: response.data.message || "Mail for reset password  Sent Successfully to your email",
      })
      //console.log("Forget Password:", response.data);
      navigate("/login");
    }
    catch (err:AxiosError | any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }


  // Define a submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission, typically by sending a reset password request to the server
   // console.log(values);
    handleForgetPassword(values);
  }

  return (
    <Form {...form}>
      <h6>EvitalRx</h6>
      <h1 className="text-2xl font-bold">Reset Your Password</h1>
      <h5 className="text-sm">
        Enter your email address and we'll send you a link to reset your password. Already have an account? <Link to={'/login'} className="text-blue-500 underline">Login here.</Link>
      </h5>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="xyz@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};

export default ForgetPassword;
