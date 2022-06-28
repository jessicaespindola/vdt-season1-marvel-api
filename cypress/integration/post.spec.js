describe("POST /characters", function () {
  it("deve cadastrar um personagem", function () {
    const character = {
      name: "Wanda Maximoff",
      alias: "Feiticeira Escarlate",
      team: ["vingadores"],
      active: true,
    };

    cy.postCharacter(character).then(function (response) {
      expect(response.status).to.eql(201);
      cy.log(response.body.character_id);
      expect(response.body.character_id.length).to.eql(24);
    });
  });

  //DESAFIO
  it("não deve permitir cadastrar um personagem sem o nome", function () {
    // Retorno: "message": "\"name\" is not allowed to be empty"
    const character = {
      name: "",
      alias: "Hulk",
      team: ["Vingadores"],
      active: true,
    };

    cy.postCharacter(character).then(function (response) {
      expect(response.status).to.eql(400);
      expect(response.body.validation.body.message).to.eql(
        '"name" is not allowed to be empty'
      );
    });
  });

  it("não deve permitir cadastrar um personagem sem o codinome", function () {
    // Retorno: "message": "\"alias\" is not allowed to be empty"
    const character = {
      name: "Steven Rogers",
      alias: "",
      team: ["Vingadores"],
      active: true,
    };

    cy.postCharacter(character).then(function (response) {
      expect(response.status).to.eql(400);
      expect(response.body.validation.body.message).to.eql(
        '"alias" is not allowed to be empty'
      );
    });
  });

  it("não deve permitir cadastrar um personagem sem a afiliação", function () {
    // Retorno: "message": "\"team[0]\" is not allowed to be empty"

    const character = {
      name: "T Challa",
      alias: "Pantera Negra",
      team: [""],
      active: true,
    };

    cy.postCharacter(character).then(function (response) {
      expect(response.status).to.eql(400);
      expect(response.body.validation.body.message).to.eql(
        '"team[0]" is not allowed to be empty'
      );
    });
  });

  it("não deve permitir cadastrar um personagem sem o active", function () {
    // Retorno: "message": "\"active\" is required"

    const character = {
      name: "Victor von Doom",
      alias: "Doutor Destino",
      team: ["Mestres do Terror", "Parlamento de Destino"],
    };
    cy.postCharacter(character).then(function (response) {
      expect(response.status).to.eql(400);
      expect(response.body.validation.body.message).to.eql(
        '"active" is required'
      );
    });
  });

  it("deve permitir cadastrar um personagem sem a idade", function () {
    const character = {
      name: "Jean Grey",
      alias: "Jean Grey",
      team: ["Os Doze"],
      active: true,
    };
    cy.postCharacter(character).then(function (response) {
      expect(response.status).to.eql(201);
      cy.log(response.body.character_id);
      expect(response.body.character_id.length).to.eql(24);
    });
  });

  it("deve permitir cadastrar um personagem inativo", function () {
    const character = {
      name: "Devorador de mundos",
      alias: "Galactus",
      team: ["Arautos de Galactus"],
      active: false,
    };
    cy.postCharacter(character).then(function (response) {
      expect(response.status).to.eql(201);
      cy.log(response.body.character_id);
      expect(response.body.character_id.length).to.eql(24);
    });
  });

  context("quando o personagem já existe", function () {
    const character = {
      name: "Pietro Maximoff",
      alias: "Mercurio",
      team: ["vingadores da costa oeste", "irmandade de mutantes"],
      active: true,
    };

    before(function () {
      cy.postCharacter(character).then(function (response) {
        expect(response.status).to.eql(201);
      });
    });

    it("nao deve cadastrar duplicado", function () {
      cy.postCharacter(character).then(function (response) {
        expect(response.status).to.eql(400);
        expect(response.body.error).to.eql("Duplicate character");
      });
    });
  });
});
