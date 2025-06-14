import { getServerSession } from "next-auth";
import SuperAdminProductListingPage from "./products/list/page";

async function SuperAdmin() {
  return <SuperAdminProductListingPage />;
}

export default SuperAdmin;
