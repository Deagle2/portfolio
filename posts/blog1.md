---
title: Nothing's ever random
date: 2026-10-08
summary: Making LEDs random?¿
tags: Shrike, RTL, Fun
---
 
Hey there!👋
First blog, so I'll try to keep this one pretty short.

I wanted to build a pretty simple project on my [Shrike-Lite](https://docs.zephyrproject.org/latest/boards/vicharak/shrike_lite/doc/index.html) dev board (**pretty cool board by [Vicharak](https://vicharak.in/), btw! RP2040 + ForgeFPGA SLG47910**).

I thought of building a simple LED reaction timer. The idea was straightforward. You wait for an LED to light up, hit Enter as fast as you can, and find out how terrible your reaction time is. Simple enough, right? 

But I didn't want to have to deal with extra components like breadboards, resistors, and external LEDs, so I decided to stick with the onboard LED.
The setup was pretty simple:RTL → Synthesis & PNR → Generate Bitstream → connect the board via USB-C → Flash bitstream onto the board. You interact with the terminal only, so it's a pretty simple beginner project!

I didn't want the LED to be predictable, since that would defeat the whole point, and that's how I started exploring Random Number Generation.

There's so many ways to generate a random number: PRNGs, TRNGs and QRNGs.
Computers can't really do random, so they fake "being random" really well. If you've ever used a `random()` or `randomize()`, it's not really random, it uses an algorithm, meaning the results are deterministic.

That's when I came across PRNGs & TRNGs, the thing is PRNGs are also deterministic but its a great starting point. On the other hand, TRNGs aren't deterministic, since they rely on process variations, physical noise etc. They're pretty cool but making one for a toy project is overkill, considering all the factors involved.

While looking into implementing one on an FPGA, I came across Linear Feedback Shift Registers (LFSRs). These are exactly what the industry uses for Design-for-Testability (DFT) and pseudo-random test pattern generation.

It's basically a **shift register whose input bit is a linear function of its previous state** and **certain bits (called taps) are XORed together and fed back** into the register.

Here's how it works:
1. Take a row of bits
2. XOR a few specific bits together (the *taps*)
3. Shift everything over, put the XOR result in the empty spot
4. Repeat forever

*Here's an example that might help it click:*
![LFSR example](posts/assets/b1/lfsr.png)
Ref: https://www.cs.princeton.edu/courses/archive/fall18/cos126/assignments/lfsr/

My LFSR implements a Fibonacci LFSR (also called external-XOR), it's a simpler version compared to Galois (internal-XOR) which works differently.
And here's the feedback logic I used:

```verilog
wire w_fb = r_lfsr[31] ^ r_lfsr[21] ^ r_lfsr[1] ^ r_lfsr[0];
```

But given the same seed, an LFSR gives out same random sequence every time, so to make things less predictable, I used a free-running 32-bit counter to seed the LFSR whenever the MCU triggered a round. The LFSR output determined the LED's delay, up to roughly 5.5 seconds.


A maximal length 32-bit LFSR cycles through about **4.29 billion** states before repeating and I guess that's way more than enough *randomization* for this demo😅.

Oh and you can check out the whole project in the [Shrike upstream repository](https://github.com/vicharak-in/shrike/tree/main/examples/led_reaction_timer). The steps are pretty simple so you can try it out yourself.


## Don't use this for anything secret

LFSRs are *linear*, so anyone who sees enough outputs can work out the whole sequence. It's great randomization for toy projects but terrible for keys and security. For that, you'd need a cryptographically secure RNG. So it got me wondering, what actually counts as random

#### Heres a quick Summary

- **PRNGs:** Looks random, is deterministic.
- **TRNGs:** Acts random, is just physics we can't model
- **Quantum RNGs:** Is truly random, as far as we know.

So I guess pure randomness isn't as straightforward as we think, and all this just because of a toy project.
Which reminds me of this:

![The Weeknd Quote](posts/assets/b1/quote.jpg)

He might've been onto something...

**At least when it comes to my LFSR.**






