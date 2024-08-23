import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { userService } from "@/services/api/user"
import { useState } from "react"
import { AxiosError } from "axios"

const formSchema = z.object({
    email: z
    .string()
    .min(5, { message: "This field has to be filled." })
    .email("This is not a valid email."),
    password: z.string().min(6, { message: "Password must be at least 8 characters." }),

})

const Login=()=> {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   // 1. Define your form.
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
        password: "",
    },
  })

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.login(values);
      // Handle successful login (e.g., navigate to dashboard, save token, etc.)
      console.log("Login successful:", response.data);
      navigate("/dashboard");
    } catch (err:AxiosError | any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
      //setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
   // 2. Define a submit handler.
   function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    handleLogin(values)
  }

  return (

    <Form {...form}>
        <h6>EvitalRx</h6>
        <h1 className='text-2xl font-bold '>Login to your Account</h1>
        <h5 className="text-sm">Start your website in seconds. Dont't have an account? <Link to={'/register'} className="text-blue-500">Register here.</Link> </h5>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="xyz@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-gray-600">
  Forgot your password? <Link to={'/forgot-password'} className="text-blue-500 underline">Click here to reset it</Link>.
</p>
{error && <p>{error}</p>}
        <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  )
}

export default Login;
