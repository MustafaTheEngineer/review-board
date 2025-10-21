package handlers

import (
	"context"
	"fmt"
	"net/http"
	"regexp"

	"github.com/99designs/gqlgen/graphql"
	apiConfig "github.com/MustafaTheEngineer/review_board/config/api"
	"github.com/MustafaTheEngineer/review_board/types"
	"github.com/google/uuid"

	dbConfig "github.com/MustafaTheEngineer/review_board/config/db"
	generated "github.com/MustafaTheEngineer/review_board/graph/generated"
	"github.com/MustafaTheEngineer/review_board/helpers"
	"github.com/golang-jwt/jwt/v5"
)

func defineDirectives(c *generated.Config) {
	c.Directives.ValidateEmail = func(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
		email := graphql.GetOperationContext(ctx).Variables["input"].(map[string]any)["email"].(string)
		err = helpers.V.VarWithKey("email", email, "email")
		if err != nil {
			helpers.CreateGraphQLError(ctx, err.Error(), http.StatusNotAcceptable)
			return nil, nil
		}

		return next(ctx)
	}

	c.Directives.ValidatePassword = func(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
		password := graphql.GetOperationContext(ctx).Variables["input"].(map[string]any)["password"].(string)
		err = helpers.V.VarWithKey("password", password, "min=8,max=20")
		if err != nil {
			helpers.CreateGraphQLError(ctx, err.Error(), http.StatusNotAcceptable)
			return nil, nil
		}

		return next(ctx)
	}

	c.Directives.ValidateToken = func(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
		rawCookies := graphql.GetOperationContext(ctx).Headers.Get("Cookie")
		if rawCookies == "" {
			helpers.CreateGraphQLError(ctx, "No cookies provided", http.StatusUnauthorized)
			return nil, nil
		}
		cookies := (&http.Request{Header: http.Header{"Cookie": []string{rawCookies}}}).Cookies()

		var authToken string
		for _, cookie := range cookies {
			if cookie.Name == "auth_token" {
				authToken = cookie.Value
			}
		}

		if authToken == "" {
			helpers.CreateGraphQLError(ctx, "Missing or expired token", http.StatusUnauthorized)
			return nil, err
		}

		token, err := jwt.Parse(authToken, func(token *jwt.Token) (any, error) {
			return []byte(apiConfig.ApiCfg.JWTSecret), nil
		}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

		if err != nil {
			helpers.CreateGraphQLError(ctx, "Invalid token", http.StatusUnauthorized)
			return nil, nil
		}
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userID, err := uuid.Parse(claims["sub"].(string))
			if err != nil {
				helpers.CreateGraphQLError(ctx, "Invalid token", http.StatusUnauthorized)
				return nil, nil
			}

			user, err := dbConfig.DbCfg.Queries.GetUserByID(ctx, userID)
			if err != nil {
				helpers.CreateGraphQLError(ctx, "Error while validating token", http.StatusInternalServerError)
				return nil, nil
			}
			ctx := context.WithValue(ctx, types.UserContextKey, types.UserContext{User: user})
			fmt.Println(user.Confirmed)
			return next(ctx)

		} else {
			helpers.CreateGraphQLError(ctx, "Invalid token", http.StatusUnauthorized)
			return nil, nil
		}
	}

	c.Directives.CheckIfConfirmed = func(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
		userContext, ok := ctx.Value(types.UserContextKey).(types.UserContext)
		fmt.Println("reached if confirmed")
		if !ok {
			helpers.CreateGraphQLError(ctx, "Confirmation check requires authentication", http.StatusUnauthorized)
			return nil, nil
		}
		if !userContext.User.Confirmed {
			
			helpers.CreateGraphQLError(ctx, "User is not confirmed", http.StatusUnauthorized)
			return nil, nil
		}

		return next(ctx)
	}

	c.Directives.CheckUsername = func(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
		userContext, ok := ctx.Value(types.UserContextKey).(types.UserContext)
		fmt.Println("reached username")
		if !ok {
			helpers.CreateGraphQLError(ctx, "Username check requires authentication", http.StatusUnauthorized)
			return nil, nil
		}

		if !userContext.User.Username.Valid {
			helpers.CreateGraphQLError(ctx, "Username is not provided", http.StatusBadRequest)
			return nil, nil
		}

		return next(ctx)
	}

	c.Directives.ValidateUsername = func(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
		username := graphql.GetOperationContext(ctx).Variables["input"].(string)
		fmt.Println("reached val username")
		_, err = regexp.Compile("^[a-zA-Z0-9][a-zA-Z0-9._-]*$")
		if err != nil {
			helpers.CreateGraphQLError(ctx, "Invalid username format", http.StatusBadRequest)
			return nil, nil
		}
		err = helpers.V.VarWithKey("username", username, "min=3,max=20")
		if err != nil {
			helpers.CreateGraphQLError(ctx, err.Error(), http.StatusNotAcceptable)
			return nil, nil
		}
		return next(ctx)
	}
}
