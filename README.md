# Elliptic Curve Arithmetic — Interactive Presentation & Seminar

**Presenter:** Guru Prakash A  
**Class:** II - MCA  
**Register No:** 25322011  
**Subject:** Network Security (Semester 3)  
**Reference:** *Cryptography and Network Security: Principles and Practice* — William Stallings (Chapter 10)  

---

## 🌐 Live Web Presentation Link
Access the full interactive web presentation here:  
👉 **[https://gurup7029-coder.github.io/ecc-presentation/](https://gurup7029-coder.github.io/ecc-presentation/)**

---

## 📖 Presentation Modules

1. **Foundations & Concepts**
   - The RSA Scaling Bottleneck & NIST SP 800-57 Key Size Equivalence
   - What is an Elliptic Curve? (Weierstrass Form $y^2 = x^3 + ax + b$, Point at Infinity $\mathcal{O}$)
   - Why Elliptic Curves are Used in Modern Cryptography (Abelian Group Structure & Immunity to Index Calculus)
   - Abelian Group Axioms ($A_1$ to $A_5$) & ECC Analogies

2. **Real Curves & Geometric Rules**
   - Elliptic Curves over Real Numbers $\mathbb{R}$ & Non-Singularity Condition ($4a^3 + 27b^2 \neq 0$)
   - The 5 Fundamental Geometric Addition Rules (Chord-and-Tangent Law)
   - Point Doubling via Tangent Line Construction ($\lambda = \frac{3x_P^2 + a}{2y_P}$)
   - Algebraic Closed-Form Coordinate Formulas

3. **Prime Curves over $\mathbb{Z}_p$**
   - Dual Cryptographic Families: Software ALUs ($\mathbb{Z}_p$) vs Hardware Logic Gates ($GF(2^m)$)
   - Modular Cubic Equations $E_p(a, b)$ & Hasse's Theorem ($p+1-2\sqrt{p} \le N \le p+1+2\sqrt{p}$)
   - The 4 Formal Addition Rules over $\mathbb{Z}_p$ with Modular Multiplicative Inversion
   - **Worked Numerical Example 1:** Point Addition $P + Q$ on $E_{23}(1, 1)$ ($P=(3,10), Q=(9,7) \to (17,20)$)
   - **Worked Numerical Example 2:** Point Doubling $2P$ on $E_{23}(1, 1)$ ($P=(3,10) \to (7,12)$)

4. **Binary Curves & Scalability**
   - Binary Field Representation in Characteristic 2: $y^2 + xy = x^3 + ax^2 + b$
   - Concrete $GF(2^4)$ Verification with Generator Polynomial $f(x) = x^4 + x + 1$
   - Master Comparison Matrix: $\mathbb{Z}_p$ vs $GF(2^m)$
   - Scalar Multiplication & the Double-and-Add Algorithm ($21P = 10101_2$)

---

## 💻 Tech Stack
- **Web Presentation:** HTML5, CSS3, Vanilla JavaScript, MathJax 3, HTML5 Canvas
- **PowerPoint Presentation:** Generated via `generate_pptx.py` with 16:9 widescreen layout, Outfit / Segoe UI / Consolas typography, and native slide transitions
