package handlers

import (
	"context"
	"net/http"

	"github.com/99designs/gqlgen/graphql"
	generated "github.com/MustafaTheEngineer/review_board/graph/generated"
	"github.com/MustafaTheEngineer/review_board/helpers"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func defineDirectives(c *generated.Config) {
	c.Directives.ValidateEmail = func(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
		email := graphql.GetOperationContext(ctx).Variables["input"].(map[string]any)["email"].(string)
		err = helpers.V.VarWithKey("email", email, "email")
		if err != nil {
			graphql.AddError(ctx, &gqlerror.Error{
				Path:    graphql.GetPath(ctx),
				Message: err.Error(),
				Extensions: map[string]any{
					"code": http.StatusNotAcceptable,
				},
			})
			return nil, err
		}

		return next(ctx)
	}

	c.Directives.ValidatePassword = func(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
		password := graphql.GetOperationContext(ctx).Variables["input"].(map[string]any)["password"].(string)
		err = helpers.V.VarWithKey("password", password, "min=8,max=20")
		if err != nil {
			graphql.AddError(ctx, &gqlerror.Error{
				Path:    graphql.GetPath(ctx),
				Message: err.Error(),
				Extensions: map[string]any{
					"code": http.StatusNotAcceptable,
				},
			})
			return nil, err
		}

		return next(ctx)
	}
}
