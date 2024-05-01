import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { color } from "framer-motion";
import FormSearch from "@/components/form/form.search";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 ">
			<div style={{textAlign:"center"}}>
				<h1 className={title()}style={{fontSize:"2rem"}}>Red Ratio Graph</h1>
				<br />
				<h1 className={title()}style={{fontSize:"2rem"}}>
					by Time Zone&nbsp;
				</h1>

				<h1 className={title({ color: "blue" })}style={{fontSize:"2rem"}}>
					(Baratsuki)
				</h1>
				<h2 className={subtitle({ class: "mt-2" })}>
					Beautiful, fast and modern React UI library.
				</h2>
			</div>
			<FormSearch/>

			
		</section>
	);
}
