import { type Metadata } from "next";
import Image from "next/image";
import { aboutMeHeadline, aboutParagraphs } from "@/config/infoConfig";
import { Container } from "@/components/layout/Container";

import portraitImage from "@/images/portrait.jpg";
import SocialLinks from "@/components/about/SocialLinks";
import Trick from "./trick";

export const metadata: Metadata = {
	title: "About",
	description:
		"Learn about Tuxi, a passionate full-stack web developer and indie hacker exploring cutting-edge tech. Connect through projects, blogs, and social media.",
};

export default function About() {
	return (
		<div className="relative">
			<Container className="mt-16 sm:mt-32">
				<div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
					<div className="lg:pl-20">
						<div className="max-w-xs px-2.5 lg:max-w-none">
							<Image
								src={portraitImage}
								alt=""
								sizes="(min-width: 1024px) 32rem, 20rem"
								className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
							/>
						</div>
					</div>
					<div className="lg:order-first lg:row-span-2">
						<h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
							{aboutMeHeadline}
						</h1>
						<div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
							{aboutParagraphs.map((paragraph, index) => (
								<p key={index}>{paragraph}</p>
							))}
						</div>
					</div>
					<div className="lg:pl-20">
						<SocialLinks />
					</div>
				</div>
			</Container>
			<Trick />
		</div>
	);
}
