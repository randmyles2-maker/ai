import sympy as sp
import numpy as np

class MathEngine:
    def solve_complex(self, equation_str):
        # Handles Calculus, Physics formulas, etc.
        expr = sp.sympify(equation_str)
        return sp.solve(expr)

    def get_physical_constants(self):
        return {
            "c": 299792458,       # Speed of light
            "G": 6.67430e-11,     # Gravitational constant
            "h": 6.62607015e-34   # Planck constant
        }
