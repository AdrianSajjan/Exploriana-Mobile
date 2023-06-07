import { FormikProps } from "formik";

export function isInvalid<T = any>(field: string | string[], form: Pick<FormikProps<T>, "touched" | "errors">): boolean {
  if (Array.isArray(field)) return field.some((_field) => Boolean(form.touched[_field]) && Boolean(form.errors[_field]));
  return Boolean(form.touched[field]) && Boolean(form.errors[field]);
}

export function errorText<T = any>(field: string | string[], form: Pick<FormikProps<T>, "touched" | "errors">): string {
  if (Array.isArray(field)) {
    const error = field.find((_field) => Boolean(form.touched[_field]) && Boolean(form.errors[_field]));
    return (Boolean(form.touched[error]) && form.errors[error]) ?? "";
  }
  return (Boolean(form.touched[field]) && form.errors[field]) ?? "";
}
