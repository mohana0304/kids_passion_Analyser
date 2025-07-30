import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Kids-themed colors
				music: {
					DEFAULT: 'hsl(var(--music))',
					foreground: 'hsl(var(--music-foreground))'
				},
				nature: {
					DEFAULT: 'hsl(var(--nature))',
					foreground: 'hsl(var(--nature-foreground))'
				},
				engineering: {
					DEFAULT: 'hsl(var(--engineering))',
					foreground: 'hsl(var(--engineering-foreground))'
				},
				learning: {
					DEFAULT: 'hsl(var(--learning))',
					foreground: 'hsl(var(--learning-foreground))'
				},
				art: {
					DEFAULT: 'hsl(var(--art))',
					foreground: 'hsl(var(--art-foreground))'
				},
				cooking: {
					DEFAULT: 'hsl(var(--cooking))',
					foreground: 'hsl(var(--cooking-foreground))'
				},
				fashion: {
					DEFAULT: 'hsl(var(--fashion))',
					foreground: 'hsl(var(--fashion-foreground))'
				},
				sports: {
					DEFAULT: 'hsl(var(--sports))',
					foreground: 'hsl(var(--sports-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'bounce-in': {
					'0%': {
						transform: 'scale(0.3)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.05)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'wiggle': {
					'0%, 100%': {
						transform: 'rotate(-3deg)'
					},
					'50%': {
						transform: 'rotate(3deg)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'pop': {
					'0%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.1)'
					},
					'100%': {
						transform: 'scale(1)'
					}
				},
				'rainbow': {
					'0%': {
						background: 'hsl(var(--music))'
					},
					'16%': {
						background: 'hsl(var(--nature))'
					},
					'33%': {
						background: 'hsl(var(--engineering))'
					},
					'50%': {
						background: 'hsl(var(--learning))'
					},
					'66%': {
						background: 'hsl(var(--art))'
					},
					'83%': {
						background: 'hsl(var(--cooking))'
					},
					'100%': {
						background: 'hsl(var(--music))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-in': 'bounce-in 0.6s var(--bounce-timing)',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'pop': 'pop 0.3s ease-in-out',
				'rainbow': 'rainbow 5s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
