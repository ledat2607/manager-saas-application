import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/logoTM.png"
                alt="Task Manager"
                className="h-10 w-auto"
              />
              <span className="text-lg font-bold">
                Task
                <span className="ml-1 bg-linear-to-r from-indigo-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
                  Manager
                </span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A modern task management tool for productivity lovers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#">Features</Link>
              </li>
              <li>
                <Link to="#">Pricing</Link>
              </li>
              <li>
                <Link to="#">Use Cases</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="#">About</Link>
              </li>
              <li>
                <Link to="#">Blog</Link>
              </li>
              <li>
                <Link to="#">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Connect</h4>
            <div className="flex gap-4 text-muted-foreground">
              <a href="#">
                <Github className="h-5 w-5" />
              </a>
              <a href="#">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Task Manager. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
