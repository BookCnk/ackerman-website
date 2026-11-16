import { redirect } from "next/navigation";

export default function TiresRedirectPage() {
  redirect("/shop?category=Tires");
}
