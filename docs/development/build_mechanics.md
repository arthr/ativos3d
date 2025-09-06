# Mecânica do modo Construção
- Grid baseado em tiles (20x20 no MVP).
- Objetos possuem footprint, clearance, slots e requisitos.
- Pipeline de colocação: snap -> colisão -> clearance -> requisitos -> retorno.
- Paredes como segmentos ortogonais entre tiles.
- Portas e janelas substituem segmentos de parede.
