import {
  DollarSign,
  Eye,
  EyeOff,
  Home,
  Lock,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Github,
  Loader2,
  Mail,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  type Icon as LucideIconType,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  google: (props: any) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
  github: Github,
  spinner: Loader2,
  mail: Mail,
  arrowRight: ArrowRight,
  check: Check,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  copy: Copy,
  creditCard: CreditCard,
  file: FileText,
  help: HelpCircle,
  image: Image,
  eyeOff: EyeOff,
  eye: Eye,
  laptop: Laptop,
  moon: Moon,
  more: MoreVertical,
  pizza: Pizza,
  plus: Plus,
  settings: Settings,
  sun: SunMedium,
  trash: Trash,
  twitter: Twitter,
  user: User,
  close: X,
  users: Users,
  logo: Lock,
  shoppingCart: ShoppingCart,
  dollarSign: DollarSign,
  trendingUp: TrendingUp,
  star: Star,
};
