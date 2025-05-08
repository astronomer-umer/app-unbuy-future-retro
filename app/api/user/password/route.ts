import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"
import bcrypt from "bcrypt"

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
})

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const result = passwordSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten()
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: errors.fieldErrors,
        },
        { status: 400 },
      )
    }

    const { currentPassword, newPassword } = body

    // Get user with password
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json({ message: "User not found or no password set" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Generate a password reset token (for simplicity, using a random string here)
    const resetToken = Math.random().toString(36).substring(2);

    // Save the token to the database (in a real app, you would also set an expiration time)
    await prisma.user.update({
      where: { email },
      data: { resetToken },
    });

    // Send the reset token to the user's email (mocked here)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return NextResponse.json({ message: "Password reset email sent." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { resetToken: token } });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null },
    });

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
