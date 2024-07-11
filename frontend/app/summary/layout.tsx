export default function BlogLayout({
	children,
  }: {
	children: React.ReactNode;
  }) {
	return (
	  <section
		className="flex"
		style={{
		  minWidth: "100%",
		  flex: "1",
		  minHeight: "100%",
		}}
	  >
		{children}
	  </section>
	);
  }
  