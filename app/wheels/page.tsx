import { redirect } from "next/navigation";

export default function WheelsRedirectPage() {
  redirect("/shop?category=Wheels");
}
