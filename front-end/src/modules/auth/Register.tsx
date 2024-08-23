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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { userService } from "@/services/api/user";
import { useState } from "react";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  email: z.string().min(5, { message: "This field has to be filled." }).email("This is not a valid email."),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  mobile: z.string().min(10,{message:"Mobile number must be 10 digits."}). max(10, { message: "Mobile number must be 10 digits." }),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required." }),
  dob: z.string().min(1, { message: "Date of birth is required." }),
  address: z.string().min(1, { message: "Address is required." }),
});

const Register = () => {
  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      mobile: "",
      gender: "male",
      dob: "",
      address: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 const navigate = useNavigate();
  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError(null);
      // Call the register API.
     const response= await userService.register(values);
     toast({
      title: response.data.message || "Mail Sent Successfully to your email",
    })
      // Redirect to the login page.
      const activationToken = response.data.activationToken;
      Cookies.set('activation_Token', activationToken, { expires: 1/288, sameSite: 'Lax' }); // expires in 5 minutes
      navigate("/otp");
    } catch (err:AxiosError | any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  // Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
   // console.log(values);
    handleRegister(values);
  }

  return (
    <Form {...form}>
      <h6>EvitalRx</h6>
      <h1 className="text-2xl font-bold">Create your Account</h1>
      <h5 className="text-sm">
        Start your website in seconds. Already have an account? <Link to={'/login'} className="text-blue-500 underline">Login here.</Link>
      </h5>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Username and Mobile Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="564******7" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email and Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup className="flex space-x-1" defaultValue={field.value} onValueChange={field.onChange}  >
                  <RadioGroupItem value="male"  id="male" /> <Label htmlFor="male">Male</Label>
                  <RadioGroupItem value="female" id="female" /> <Label htmlFor="female">Female</Label>
                  <RadioGroupItem value="other" id="other" /> <Label htmlFor="other">Other</Label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your address" {...field} />
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

export default Register;
