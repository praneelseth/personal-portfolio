# Example Blog Post

This file shows every supported markdown feature for blog posts.

---

## Headers

# H1 — big section title
## H2 — subsection
### H3 — sub-subsection

---

## Paragraphs and line breaks

This is a regular paragraph. Just type normally and leave
a blank line between paragraphs to separate them.

This is a second paragraph.

Use \n to force a line break inside one paragraph.\nLike this — same paragraph, new line.\nAnd another line here.

---

## Bullet lists

* first item
* second item
* third item

Use * or - to start a list. Keep items on consecutive lines (no blank lines between them).

---

## Code blocks

```js
function greet(name) {
  return `hello, ${name}`;
}
```

```python
def greet(name):
    return f"hello, {name}"
```

```bash
pnpm build
```

Language tag is optional — use ``` alone for plain text.

---

## Links

[OpenAI](https://openai.com)
[Anthropic](https://anthropic.com)

Links must be on their own line in the format [label](url).

---

## Images

![a descriptive alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Culinary_fruits_front_view.jpg/640px-Culinary_fruits_front_view.jpg)

Images use the format ![alt text](url) on their own line.

---

## Inline LaTeX

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.

Euler's identity: $e^{i\pi} + 1 = 0$.

Wrap inline math in single dollar signs: $formula$.

---

## Display (block) LaTeX

$$
\int_0^\infty e^{-x^2} \, dx = \frac{\sqrt{\pi}}{2}
$$

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
$$

Wrap block math in $$ on their own lines.

---

## Dividers

Use --- on its own line to insert a horizontal rule, like the ones above.
