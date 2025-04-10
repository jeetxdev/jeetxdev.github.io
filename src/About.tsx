import {motion} from "motion/react";

const About = () => {
  return (
    <section className="mb-24" id="about">
      <motion.div
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{duration: 0.6}}
      >
        <h3 className="text-2xl font-semibold mb-4">About Me</h3>
        <p className="text-base max-w-3xl">
          I'm a passionate web developer who’s been in the game since 2015, thriving on clean code, snappy UIs, and
          meaningful digital experiences. Whether I’m shipping features, building a custom UI lib, or mentoring devs
          — I bring the same energy: build smart, build well.
        </p>
      </motion.div>
    </section>
  )
}
export default About;