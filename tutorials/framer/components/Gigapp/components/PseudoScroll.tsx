"use client";
import React, { useState } from "react";
import nature1 from "../../../public/Nature/nature1.jpeg";
import nature2 from "../../../public/Nature/nature2.jpeg";
import nature3 from "../../../public/Nature/nature3.jpeg";
import Image from "next/image";
const PseudoScroll = () => {
  const [bannerOpen, setBannerOpen] = useState(false);
  // Sticky Scrolling Effect
  class StickySections {
    constructor(containerElement) {
      this.container = {
        el: containerElement,
        height: 0,
        top: 0,
        bottom: 0,
      };
      this.sections = Array.from(this.container.el.querySelectorAll("section"));
      this.viewportTop = 0;
      this.activeIndex = 0;
      this.scrollValue = 0; // Scroll value of the sticky container
      this.onScroll = this.onScroll.bind(this);
      this.initContainer = this.initContainer.bind(this);
      this.handleSections = this.handleSections.bind(this);
      this.remapValue = this.remapValue.bind(this);
      this.init();
    }

    onScroll() {
      this.handleSections();
    }

    initContainer() {
      this.container.el.style.setProperty(
        "--stick-items",
        `${this.sections.length + 1}00vh`
      );
      this.container.el.classList.add("[&_*]:!transition-none");
      setTimeout(() => {
        this.container.el.classList.remove("[&_*]:!transition-none");
      }, 1);
    }

    handleSections() {
      this.viewportTop = window.scrollY;
      this.container.height = this.container.el.clientHeight;
      this.container.top = this.container.el.offsetTop;
      this.container.bottom = this.container.top + this.container.height;

      if (this.container.bottom <= this.viewportTop) {
        // The bottom edge of the stickContainer is above the viewport
        this.scrollValue = this.sections.length + 1;
      } else if (this.container.top >= this.viewportTop) {
        // The top edge of the stickContainer is below the viewport
        this.scrollValue = 0;
      } else {
        // The stickContainer intersects with the viewport
        this.scrollValue = this.remapValue(
          this.viewportTop,
          this.container.top,
          this.container.bottom,
          0,
          this.sections.length + 1
        );
      }
      this.activeIndex =
        Math.floor(this.scrollValue) >= this.sections.length
          ? this.sections.length - 1
          : Math.floor(this.scrollValue);

      this.sections.forEach((section, i) => {
        if (i === this.activeIndex) {
          section.style.setProperty("--stick-visibility", "1");
          section.style.setProperty("--stick-scale", "1");
        } else {
          section.style.setProperty("--stick-visibility", "0");
          section.style.setProperty("--stick-scale", ".8");
        }
      });
    }

    // This function remaps a value from one range to another range
    remapValue(value, start1, end1, start2, end2) {
      const remapped =
        ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
      return remapped > 0 ? remapped : 0;
    }

    init() {
      this.initContainer();
      this.handleSections();
      window.addEventListener("scroll", this.onScroll);
    }
  }

  // Init StickySections
  const sectionsContainer = document.querySelectorAll("[data-sticky-sections]");
  sectionsContainer.forEach((section) => {
    new StickySections(section);
  });

  return (
    <div className="mt-32">
      {/* <div className="grid relative grid-cols-12">
        <div className="col-span-4  h-[90vh] flex justify-center items-center border">
          <div className="sticky top-0 h-32 border">Nice</div>
          <div>Hello</div>
        </div>
        <div className="col-span-8 h-[90vh]  overflow-y-scroll">
          <Image src={nature1} alt="nature1" height={500} />
          <Image src={nature2} alt="nature1" height={500} />
          <Image src={nature3} alt="nature1" height={500} />
        </div>
      </div>
      <div className="text-5xl">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi sunt
        porro nam deserunt libero amet, est at illo distinctio enim non sit,
        minima eos fugiat ad, nostrum aut dolor omnis neque ipsum error velit
        eius necessitatibus. Quod quam dolorum, repellendus molestiae commodi
        blanditiis beatae provident aperiam quia expedita ipsum iste doloremque
        molestias officiis, deserunt qui assumenda animi! Hic sint explicabo
        deleniti id ipsum delectus eos iusto cumque ducimus nihil natus ipsam
        illum atque. Laboriosam non reiciendis sed. Nisi voluptatibus recusandae
        veritatis vitae, officiis atque, ab suscipit ipsam aliquid debitis
        libero placeat sit iusto id deleniti sunt quis quasi quaerat! Distinctio
        ratione hic, dolor obcaecati earum exercitationem impedit debitis
        corporis ex, saepe, voluptatum nesciunt quas ullam sapiente nisi
        voluptates error nulla deserunt magnam sit. Aut, facere culpa. Facere
        voluptates repellendus ipsa cumque recusandae cupiditate necessitatibus
        a at similique praesentium quibusdam eveniet, nihil et magni tempora
        voluptate fugit, perspiciatis vitae omnis, inventore eligendi autem
        sequi odio? Modi corporis ipsam cumque. Quos eos sint ex et aliquid
        magnam excepturi similique voluptatum tempore commodi, aspernatur
        deserunt sapiente hic accusamus earum ratione saepe, dolorum corporis
        odio iure fuga, dicta quia repellat blanditiis! Ipsa illo optio expedita
        consequuntur amet! Beatae soluta eum, non explicabo animi eaque modi
        magnam necessitatibus? Quibusdam illo nisi in natus!
      </div> */}

      <div className="relative font-inter antialiased">
        <main className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden supports-[overflow:clip]:overflow-clip">
          <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
            <div className="h-[calc(100vh-6rem)] flex items-center justify-center text-4xl font-bold text-slate-300 text-center">
              Scroll down
            </div>

            {/* <!-- Scroll Animation --> */}
            <div
              className="max-w-md mx-auto lg:max-w-none lg:min-h-[var(--stick-items)]"
              data-sticky-sections
            >
              <div className="lg:sticky lg:top-0 lg:h-screen space-y-16 lg:space-y-0">
                {/* <!-- Section #1 --> */}
                <section className="lg:absolute lg:inset-0 lg:z-[var(--stick-visibility)]">
                  <div className="flex flex-col lg:h-full lg:flex-row space-y-4 space-y-reverse lg:space-y-0 lg:space-x-20">
                    <div className="flex-1 flex items-center lg:opacity-[var(--stick-visibility)] transition-opacity duration-300 order-1 lg:order-none">
                      <div className="space-y-3">
                        <div className="relative inline-flex text-indigo-500 font-semibold">
                          Integrated Knowledge
                          <svg
                            className="fill-indigo-300 absolute top-full w-full"
                            xmlns="http://www.w3.org/2000/svg"
                            width="166"
                            height="4"
                          >
                            <path d="M98.865 1.961c-8.893.024-17.475.085-25.716.182-2.812.019-5.023.083-7.622.116l-6.554.067a2910.9 2910.9 0 0 0-25.989.38c-4.04.067-7.709.167-11.292.27l-1.34.038c-2.587.073-4.924.168-7.762.22-2.838.051-6.054.079-9.363.095-1.994.007-2.91-.08-3.106-.225l-.028-.028c-.325-.253.203-.463 1.559-.62l.618-.059c.206-.02.42-.038.665-.054l1.502-.089 3.257-.17 2.677-.132c.902-.043 1.814-.085 2.744-.126l1.408-.06c4.688-.205 10.095-.353 16.167-.444C37.413 1.22 42.753.98 49.12.824l1.614-.037C54.041.707 57.588.647 61.27.6l1.586-.02c4.25-.051 8.53-.1 12.872-.14C80.266.4 84.912.373 89.667.354l2.866-.01c8.639-.034 17.996 0 27.322.03 6.413.006 13.168.046 20.237.12l2.368.027c1.733.014 3.653.05 5.712.105l2.068.064c5.89.191 9.025.377 11.823.64l.924.09c.802.078 1.541.156 2.21.233 1.892.233.29.343-3.235.364l-3.057.02c-.446.003-.89.008-1.33.014a305.77 305.77 0 0 1-4.33-.004c-2.917-.005-5.864-.018-8.783-.019l-4.982.003a447.91 447.91 0 0 1-3.932-.02l-4.644-.023-4.647-.014c-9.167-.026-18.341-.028-26.923.03l-.469-.043Z" />
                          </svg>
                        </div>
                        <h2 className="text-4xl text-slate-900 font-extrabold">
                          Support your users with popular topics
                        </h2>
                        <p className="text-lg text-slate-500">
                          Statistics show that people browsing your webpage who
                          receive live assistance with a chat widget are more
                          likely to make a purchase.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center lg:scale-[var(--stick-scale)] lg:opacity-[var(--stick-visibility)] transition duration-300">
                      <img
                        width="512"
                        height="480"
                        src="https://cruip-tutorials.vercel.app/sticky-scrolling/illustration-01.png"
                        alt="Illustration 01"
                      />
                    </div>
                  </div>
                </section>
                {/* <!-- Section #2 --> */}
                <section className="lg:absolute lg:inset-0 lg:z-[var(--stick-visibility)]">
                  <div className="flex flex-col lg:min-h-full lg:flex-row space-y-4 space-y-reverse lg:space-y-0 lg:space-x-20">
                    <div className="flex-1 flex items-center lg:opacity-[var(--stick-visibility)] transition-opacity duration-300 order-1 lg:order-none">
                      <div className="space-y-3">
                        <div className="relative inline-flex text-indigo-500 font-semibold">
                          Authentic Experiences
                          <svg
                            className="fill-indigo-300 absolute top-full w-full"
                            xmlns="http://www.w3.org/2000/svg"
                            width="166"
                            height="4"
                          >
                            <path d="M98.865 1.961c-8.893.024-17.475.085-25.716.182-2.812.019-5.023.083-7.622.116l-6.554.067a2910.9 2910.9 0 0 0-25.989.38c-4.04.067-7.709.167-11.292.27l-1.34.038c-2.587.073-4.924.168-7.762.22-2.838.051-6.054.079-9.363.095-1.994.007-2.91-.08-3.106-.225l-.028-.028c-.325-.253.203-.463 1.559-.62l.618-.059c.206-.02.42-.038.665-.054l1.502-.089 3.257-.17 2.677-.132c.902-.043 1.814-.085 2.744-.126l1.408-.06c4.688-.205 10.095-.353 16.167-.444C37.413 1.22 42.753.98 49.12.824l1.614-.037C54.041.707 57.588.647 61.27.6l1.586-.02c4.25-.051 8.53-.1 12.872-.14C80.266.4 84.912.373 89.667.354l2.866-.01c8.639-.034 17.996 0 27.322.03 6.413.006 13.168.046 20.237.12l2.368.027c1.733.014 3.653.05 5.712.105l2.068.064c5.89.191 9.025.377 11.823.64l.924.09c.802.078 1.541.156 2.21.233 1.892.233.29.343-3.235.364l-3.057.02c-.446.003-.89.008-1.33.014a305.77 305.77 0 0 1-4.33-.004c-2.917-.005-5.864-.018-8.783-.019l-4.982.003a447.91 447.91 0 0 1-3.932-.02l-4.644-.023-4.647-.014c-9.167-.026-18.341-.028-26.923.03l-.469-.043Z" />
                          </svg>
                        </div>
                        <h2 className="text-4xl text-slate-900 font-extrabold">
                          Personalise the support experience
                        </h2>
                        <p className="text-lg text-slate-500">
                          Statistics show that people browsing your webpage who
                          receive live assistance with a chat widget are more
                          likely to make a purchase.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center lg:scale-[var(--stick-scale)] lg:opacity-[var(--stick-visibility)] transition duration-300">
                      <img
                        width="512"
                        height="480"
                        src="https://cruip-tutorials.vercel.app/sticky-scrolling/illustration-02.png"
                        alt="Illustration 02"
                      />
                    </div>
                  </div>
                </section>
                {/* <!-- Section #3 --> */}
                <section className="lg:absolute lg:inset-0 lg:z-[var(--stick-visibility)]">
                  <div className="flex flex-col lg:min-h-full lg:flex-row space-y-4 space-y-reverse lg:space-y-0 lg:space-x-20">
                    <div className="flex-1 flex items-center lg:opacity-[var(--stick-visibility)] transition-opacity duration-300 order-1 lg:order-none">
                      <div className="space-y-3">
                        <div className="relative inline-flex text-indigo-500 font-semibold">
                          Live Assistance
                          <svg
                            className="fill-indigo-300 absolute top-full w-full"
                            xmlns="http://www.w3.org/2000/svg"
                            width="166"
                            height="4"
                          >
                            <path d="M98.865 1.961c-8.893.024-17.475.085-25.716.182-2.812.019-5.023.083-7.622.116l-6.554.067a2910.9 2910.9 0 0 0-25.989.38c-4.04.067-7.709.167-11.292.27l-1.34.038c-2.587.073-4.924.168-7.762.22-2.838.051-6.054.079-9.363.095-1.994.007-2.91-.08-3.106-.225l-.028-.028c-.325-.253.203-.463 1.559-.62l.618-.059c.206-.02.42-.038.665-.054l1.502-.089 3.257-.17 2.677-.132c.902-.043 1.814-.085 2.744-.126l1.408-.06c4.688-.205 10.095-.353 16.167-.444C37.413 1.22 42.753.98 49.12.824l1.614-.037C54.041.707 57.588.647 61.27.6l1.586-.02c4.25-.051 8.53-.1 12.872-.14C80.266.4 84.912.373 89.667.354l2.866-.01c8.639-.034 17.996 0 27.322.03 6.413.006 13.168.046 20.237.12l2.368.027c1.733.014 3.653.05 5.712.105l2.068.064c5.89.191 9.025.377 11.823.64l.924.09c.802.078 1.541.156 2.21.233 1.892.233.29.343-3.235.364l-3.057.02c-.446.003-.89.008-1.33.014a305.77 305.77 0 0 1-4.33-.004c-2.917-.005-5.864-.018-8.783-.019l-4.982.003a447.91 447.91 0 0 1-3.932-.02l-4.644-.023-4.647-.014c-9.167-.026-18.341-.028-26.923.03l-.469-.043Z" />
                          </svg>
                        </div>
                        <h2 className="text-4xl text-slate-900 font-extrabold">
                          Scale your sales using automation
                        </h2>
                        <p className="text-lg text-slate-500">
                          Statistics show that people browsing your webpage who
                          receive live assistance with a chat widget are more
                          likely to make a purchase.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center lg:scale-[var(--stick-scale)] lg:opacity-[var(--stick-visibility)] transition duration-300">
                      <img
                        width="512"
                        height="480"
                        src="https://cruip-tutorials.vercel.app/sticky-scrolling/illustration-03.png"
                        alt="Illustration 03"
                      />
                    </div>
                  </div>
                </section>
                {/* <!-- Section #4 --> */}
                <section className="lg:absolute lg:inset-0 lg:z-[var(--stick-visibility)]">
                  <div className="flex flex-col lg:min-h-full lg:flex-row space-y-4 space-y-reverse lg:space-y-0 lg:space-x-20">
                    <div className="flex-1 flex items-center lg:opacity-[var(--stick-visibility)] transition-opacity duration-300 order-1 lg:order-none">
                      <div className="space-y-3">
                        <div className="relative inline-flex text-indigo-500 font-semibold">
                          Satisfaction Guaranteed
                          <svg
                            className="fill-indigo-300 absolute top-full w-full"
                            xmlns="http://www.w3.org/2000/svg"
                            width="166"
                            height="4"
                          >
                            <path d="M98.865 1.961c-8.893.024-17.475.085-25.716.182-2.812.019-5.023.083-7.622.116l-6.554.067a2910.9 2910.9 0 0 0-25.989.38c-4.04.067-7.709.167-11.292.27l-1.34.038c-2.587.073-4.924.168-7.762.22-2.838.051-6.054.079-9.363.095-1.994.007-2.91-.08-3.106-.225l-.028-.028c-.325-.253.203-.463 1.559-.62l.618-.059c.206-.02.42-.038.665-.054l1.502-.089 3.257-.17 2.677-.132c.902-.043 1.814-.085 2.744-.126l1.408-.06c4.688-.205 10.095-.353 16.167-.444C37.413 1.22 42.753.98 49.12.824l1.614-.037C54.041.707 57.588.647 61.27.6l1.586-.02c4.25-.051 8.53-.1 12.872-.14C80.266.4 84.912.373 89.667.354l2.866-.01c8.639-.034 17.996 0 27.322.03 6.413.006 13.168.046 20.237.12l2.368.027c1.733.014 3.653.05 5.712.105l2.068.064c5.89.191 9.025.377 11.823.64l.924.09c.802.078 1.541.156 2.21.233 1.892.233.29.343-3.235.364l-3.057.02c-.446.003-.89.008-1.33.014a305.77 305.77 0 0 1-4.33-.004c-2.917-.005-5.864-.018-8.783-.019l-4.982.003a447.91 447.91 0 0 1-3.932-.02l-4.644-.023-4.647-.014c-9.167-.026-18.341-.028-26.923.03l-.469-.043Z" />
                          </svg>
                        </div>
                        <h2 className="text-4xl text-slate-900 font-extrabold">
                          Make customer satisfaction easier
                        </h2>
                        <p className="text-lg text-slate-500">
                          Statistics show that people browsing your webpage who
                          receive live assistance with a chat widget are more
                          likely to make a purchase.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center lg:scale-[var(--stick-scale)] lg:opacity-[var(--stick-visibility)] transition duration-300">
                      <img
                        width="512"
                        height="480"
                        src="https://cruip-tutorials.vercel.app/sticky-scrolling/illustration-04.png"
                        alt="Illustration 04"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
            {/* <!-- End: Scroll Animation --> */}

            <div className="h-[calc(100vh-6rem)] flex items-center justify-center text-4xl font-bold text-slate-300 text-center">
              Scroll up
            </div>
          </div>
        </main>

        {/* <!-- Page footer --> */}
        <footer className="absolute left-6 right-6 md:left-12 md:right-auto bottom-4 md:bottom-8 text-center md:text-left">
          <a
            className="text-xs text-slate-500 hover:underline"
            href="https://cruip.com"
          >
            &copy;Cruip - Tailwind CSS templates
          </a>
        </footer>

        {/* <!-- Banner with links --> */}
        <div
          className={`${
            bannerOpen ? "" : "hidden"
          } fixed bottom-0 right-0 w-full md:bottom-6 md:right-12 md:w-auto z-50`}
          x-data="{ bannerOpen: true }"
        >
          <div className="bg-slate-800 text-sm p-3 md:rounded shadow flex justify-between">
            <div className="text-slate-500 inline-flex">
              <a
                className="font-medium hover:underline text-slate-300"
                href="https://cruip.com/how-to-create-a-sticky-on-scroll-effect-with-javascript/"
                target="_blank"
              >
                Read Tutorial
              </a>
              <span className="italic px-1.5">or</span>
              <a
                className="font-medium hover:underline text-indigo-500 flex items-center"
                href="https://github.com/cruip/cruip-tutorials/blob/main/sticky-scrolling/"
                target="_blank"
                rel="noreferrer"
              >
                <span>Download</span>
                <svg
                  className="fill-indigo-400 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="9"
                >
                  <path d="m1.649 8.514-.91-.915 5.514-5.523H2.027l.01-1.258h6.388v6.394H7.158l.01-4.226z" />
                </svg>
              </a>
            </div>
            <button
              onClick={() => setBannerOpen(false)}
              className="text-slate-500 hover:text-slate-400 pl-2 ml-3 border-l border-slate-700"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-4 h-4 shrink-0 fill-current"
                viewBox="0 0 16 16"
              >
                <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PseudoScroll;
