import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "@/api/feature/auth/postSlice"
import { useTranslation } from "react-i18next"

const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const schema = z.object({
    email: z.string().trim().email({ message: t('auth.validation.emailInvalid') }).min(1).max(50),
    password: z.string().trim().min(5, { message: t('auth.validation.passwordMinLength') })
      .max(20, { message: t('auth.validation.passwordMaxLength') }),
  })

  type FormData = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    delayError: 300
  })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap()

      if (response.data?.accessToken && response.data?.refreshToken) {
        const decodedToken = decodeJWT(response.data.accessToken);

        if (decodedToken) {
          localStorage.setItem("userRole", decodedToken.role);
          localStorage.setItem("userId", decodedToken.nameid);
        }
        if (response.data.permissions && Array.isArray(response.data.permissions)) {
          localStorage.setItem('userPermissions', JSON.stringify(response.data.permissions))
        }
        localStorage.setItem("accessToken", response.data.accessToken)
        localStorage.setItem("refreshToken", response.data.refreshToken)
        navigate("/")
      } else {
        setError("root", {
          message: t('auth.errors.invalidCredentials')
        })
      }
    } catch (err: any) {
      setError("root", { message: t('auth.errors.invalidEmailPassword') })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{t('auth.title')}</h1>
                <p className="text-muted-foreground text-balance">
                  {t('auth.subtitle')}
                </p>
              </div>

              {errors.root && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center">
                  {errors.root.message}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">{t('auth.email')}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.placeholders.email')}
                  required
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{t('auth.password')}</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.placeholders.password')}
                  required
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('auth.signingIn')}
                    </div>
                  ) : (
                    t('auth.login')
                  )}
                </Button>
              </Field>

            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/login.svg"
              alt={t('auth.imageAlt')}
              className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}